import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailTemplates } from '@/lib/email'

async function isAdmin(supabase: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return false
  }

  // Get user's role from the profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  return profile?.role === 'admin'
}

export async function GET() {
  const supabase = await createClient()

  // Check if user is admin
  if (!await isAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get pending sellers with their addresses in a single query
  const { data: sellers, error } = await supabaseAdmin
    .from('sellers')
    .select(`
      *,
      seller_addresses (
        street,
        city,
        country,
        postal_code,
        website,
        siren,
        tax_id,
        vat_number
      )
    `)
    .eq('identity_verified', false)
    .eq('identity_rejected', false)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching sellers:', error)
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 })
  }

  return NextResponse.json({ sellers })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if user is admin
  if (!await isAdmin(supabase)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { sellerId, action, reason } = await request.json()

  if (!sellerId || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('sellers')
      .update({ identity_verified: true, identity_rejected: false })
      .eq('id', sellerId)

    if (error) {
      console.error('Error approving seller:', error)
      return NextResponse.json({ error: 'Failed to approve seller' }, { status: 500 })
    }

    // Get seller's email and company name
    const { data: seller } = await supabaseAdmin
      .from('sellers')
      .select('email, company_name')
      .eq('id', sellerId)
      .single()

    if (seller) {
      try {
        // Send verification email
        await sendEmail({
          ...emailTemplates.sellerVerified(seller.company_name),
          to: seller.email
        })
        console.log('✅ Verification email sent to:', seller.email)
      } catch (emailError) {
        console.error('❌ Error sending verification email:', emailError)
        // Don't return error to client, just log it
      }
    }

    return NextResponse.json({ message: 'Seller approved successfully' })
  } else if (action === 'decline') {
    if (!reason) {
      return NextResponse.json({ error: 'Reason is required for declining' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('sellers')
      .update({ identity_rejected: true, identity_verified: false })
      .eq('id', sellerId)

    if (error) {
      console.error('Error declining seller:', error)
      return NextResponse.json({ error: 'Failed to decline seller' }, { status: 500 })
    }

    // Get seller's email and company name
    const { data: seller } = await supabaseAdmin
      .from('sellers')
      .select('email, company_name')
      .eq('id', sellerId)
      .single()

    if (seller) {
      try {
        // Send rejection email
        await sendEmail({
          ...emailTemplates.sellerRejected(seller.company_name, reason),
          to: seller.email
        })
        console.log('✅ Rejection email sent to:', seller.email)
      } catch (emailError) {
        console.error('❌ Error sending rejection email:', emailError)
        // Don't return error to client, just log it
      }
    }

    return NextResponse.json({ message: 'Seller declined successfully' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
} 
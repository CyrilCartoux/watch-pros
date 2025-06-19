import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { sendEmail, emailTemplates } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/admin'

const UpdateOfferSchema = z.object({
  action: z.enum(['accept', 'decline'])
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('seller_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = UpdateOfferSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      )
    }

    const { action } = result.data

    // Get the offer and check if the user is the owner of the listing
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        listing:listings!offers_listing_id_fkey (
          id,
          title,
          seller_id,
          status
        ),
        seller:sellers!offers_seller_id_fkey (
          email,
          user_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (offerError || !offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }

    // Check if the user is the owner of the listing
    if (offer.listing.seller_id !== profile.seller_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update the offer
    const { error: updateError } = await supabase
      .from('offers')
      .update({ is_accepted: action === 'accept' })
      .eq('id', params.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update offer' },
        { status: 500 }
      )
    }

    // If the offer is accepted or declined, update the listing status to sold
    if (action === 'accept' || action === 'decline') {
      // Send email to the buyer
      try {
        if (action === 'accept') {
          await sendEmail({
            to: offer.seller.email,
            ...emailTemplates.offerAccepted(
              offer.listing.title,
              offer.offer,
              offer.currency,
              offer.listing.id
            )
          })
        } else if (action === 'decline') {
          await sendEmail({
            to: offer.seller.email,
            ...emailTemplates.offerDeclined(
              offer.listing.title,
              offer.offer,
              offer.currency,
              offer.listing.id
            )
          })
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // We don't want to fail the request if the email fails
      }

      // Create notification for the buyer
      try {
        if (action === 'accept') {
          const { error: notificationError } = await supabaseAdmin
            .from('notifications')
            .insert({
              user_id: offer.seller.user_id,
              listing_id: offer.listing.id,
              type: 'sold_listing',
              title: 'Offer Accepted',
              message: `Your offer of ${offer.offer.toLocaleString()} ${offer.currency} for ${offer.listing.title} has been accepted.`
            })
          if (notificationError) {
            console.error('Error creating notification:', notificationError)
          }
        } else if (action === 'decline') {
          const { error: notificationError } = await supabaseAdmin
            .from('notifications')
            .insert({
              user_id: offer.seller.user_id,
              listing_id: offer.listing.id,
              type: 'declined_offer',
              title: 'Offer Declined',
              message: `Your offer of ${offer.offer.toLocaleString()} ${offer.currency} for ${offer.listing.title} has been declined.`
            })
          if (notificationError) {
            console.error('Error creating notification:', notificationError)
          }
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError)
        // We don't want to fail the request if the notification creation fails
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in update-offer:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailTemplates } from '@/lib/email'
import { ModelSubscription } from '@/types/db/notifications/ModelSubscriptions'

// if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
//   throw new Error('Missing VAPID keys')
// }

// Type for profiles query
type Profile = {
  id: string
  email: string | null
}

// Type for listing details query response
type ListingDetails = {
  id: string
  title: string
  reference: string
  description: string | null
  year: string | null
  price: number
  currency: string
  condition: string | null
  included: string | null
  brands: {
    label: string
  }
  models: {
    label: string
  }
}

// Type pour la jointure avec les utilisateurs
type ModelSubscriptionWithUser = ModelSubscription & {
  users: {
    email: string
  }
}

// webpush.setVapidDetails(
//   'mailto:you@your-domain.com',
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// )

export async function POST(request: Request) {
  console.log('📥 Webhook listing-created received')
  const signature = request.headers.get('x-supabase-signature')
  console.log('🔑 Signature received:', signature?.substring(0, 10) + '...')

  if (signature !== process.env.WEBHOOK_SECRET_CREATE) {
    console.error('❌ Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const record = payload.record

    if (!record) {
      console.error('❌ No record in webhook')
      return NextResponse.json({ error: 'No record in webhook' }, { status: 400 })
    }

    const listingId = record.id
    console.log('🏷️ New listing:', listingId)

    // Fetch listing details with brand and model names
    const { data: listingDetails, error: listingError } = await supabaseAdmin
      .from('listings')
      .select(`
        id,
        title,
        reference,
        description,
        year,
        price,
        currency,
        condition,
        included,
        brands:brand_id (
          label
        ),
        models:model_id (
          label
        )
      `)
      .eq('id', listingId)
      .single() as { data: ListingDetails | null, error: any }

    if (listingError) {
      console.error('❌ Error fetching listing details:', listingError)
      throw listingError
    }

    if (!listingDetails) {
      console.error('❌ Listing not found:', listingId)
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const brandName = listingDetails.brands?.label
    const modelName = listingDetails.models?.label

    if (!brandName || !modelName) {
      console.error('❌ Missing brand or model name:', { brandName, modelName })
      return NextResponse.json({ error: 'Missing brand or model information' }, { status: 404 })
    }

    // 1. Find model subscribers
    console.log('🔍 Searching subscribers for model:', listingDetails.models.label)
    const { data: subs, error: subErr } = await supabaseAdmin
      .from('model_subscriptions')
      .select('user_id')
      .eq('model_id', record.model_id)

    if (subErr) {
      console.error('❌ Error finding subscribers:', subErr)
      throw subErr
    }
    if (!subs?.length) {
      console.log('ℹ️ No subscribers for this model')
      return NextResponse.json({ ok: true, info: 'No subscribers for this model' })
    }
    console.log('👥 Number of subscribers found:', subs.length)

    // 2. Get user emails
    const userIds = subs.map(row => row.user_id)
    
    // Utility function to fetch emails from a list of user_ids
    async function fetchEmails(userIds: string[]): Promise<Profile[]> {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .in('id', userIds)

      if (error) throw error
      return data || []
    }

    const users = await fetchEmails(userIds)
    const validEmails = users
      .map((u) => u.email)
      .filter((e): e is string => typeof e === 'string')

    if (validEmails.length === 0) {
      console.log('ℹ️ No valid emails found for subscribers')
      return NextResponse.json({ ok: true, info: 'No valid emails found for subscribers' })
    }

    // 3. Send emails to subscribers
    console.log('📧 Sending emails to subscribers...')
    const emailResults = await Promise.allSettled(
      validEmails.map((to) => {
        const emailContent = emailTemplates.newWatchMatch(
          brandName,
          modelName,
          listingDetails.title,
          listingDetails.reference,
          listingDetails.description,
          listingDetails.year,
          listingDetails.price,
          listingDetails.currency,
          listingDetails.condition,
          listingDetails.included
        )
        return sendEmail({
          to,
          ...emailContent
        })
      })
    )

    const failedEmails = emailResults
      .map((result, index) => result.status === 'rejected' ? validEmails[index] : null)
      .filter(Boolean)

    if (failedEmails.length > 0) {
      console.log('⚠️ Failed emails:', failedEmails.length, 'emails')
    }

    // 4. Create in-app notifications
    console.log('💾 Creating in-app notifications...')
    const notificationTitle = `New ${brandName} ${modelName} listed!`
    const notificationMessage = `A new ${brandName} ${modelName} has been listed for ${listingDetails.price.toLocaleString()} ${listingDetails.currency}.`

    await supabaseAdmin.from('notifications').insert(
      userIds.map(uid => ({
        user_id: uid,
        listing_id: listingId,
        type: 'new_listing',
        title: notificationTitle,
        message: notificationMessage,
      }))
    )

    const stats = {
      totalSubscribers: userIds.length,
      emailsSent: validEmails.length - failedEmails.length,
      emailsFailed: failedEmails.length
    }
    console.log('✅ Webhook completed successfully:', stats)

    return NextResponse.json({ 
      ok: true,
      stats
    })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
} 
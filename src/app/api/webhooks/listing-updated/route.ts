import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailTemplates, EmailTemplate } from '@/lib/email'

// Type for listing_subscriptions query
type ListingSubscription = {
  user_id: string
}

// Type for profiles query
type Profile = {
  id: string
  email: string | null
}

// Type for listing details query response
type ListingDetails = {
  id: string
  brands: {
    label: string
  }
  models: {
    label: string
  }
}

// if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
//   throw new Error('Missing VAPID keys')
// }

// webpush.setVapidDetails(
//   'mailto:you@your-domain.com',
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// )

export async function POST(request: Request) {
  console.log('📥 Webhook listing-updated received')
  const signature = request.headers.get('x-supabase-signature')
  console.log('🔑 Signature received:', signature?.substring(0, 10) + '...')

  if (signature !== process.env.WEBHOOK_SECRET_UPDATE) {
    console.error('❌ Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const oldRecord = payload.old_record
    const newRecord = payload.record

    if (!oldRecord || !newRecord) {
      console.error('❌ Incomplete payload, missing old_record or record')
      return NextResponse.json({ error: 'Incomplete payload' }, { status: 400 })
    }

    const listingId = newRecord.id
    const oldPrice = oldRecord.price
    const newPrice = newRecord.price
    const oldStatus = oldRecord.status
    const newStatus = newRecord.status
    const wasSold = oldStatus !== 'sold' && newStatus === 'sold'

    // Fetch listing details with brand and model names
    const { data: listingDetails, error: listingError } = await supabaseAdmin
      .from('listings')
      .select(`
        id,
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

    console.log('🔄 Changes detected:', {
      listingId,
      oldPrice,
      newPrice,
      wasSold,
      priceChanged: newPrice !== oldPrice,
      priceDiff: newPrice - oldPrice,
      oldStatus,
      newStatus,
      brand: brandName,
      model: modelName
    })

    let totalEmailsSent = 0
    let totalEmailsFailed = 0

    // Utility function to fetch emails from a list of user_ids
    async function fetchEmails(userIds: string[]): Promise<Profile[]> {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .in('id', userIds)

      if (error) throw error
      return data || []
    }

    // 1. HANDLE "SALE" (status → "sold")
    if (wasSold) {
      console.log('💰 Listing sold, searching subscribers...')
      // Get all user_ids following this listing
      const { data: subsSell, error: subsSellErr } = await supabaseAdmin
        .from('listing_subscriptions')
        .select('user_id')
        .eq('listing_id', listingId)

      if (subsSellErr) {
        console.error('❌ Error finding subscribers:', subsSellErr)
        throw subsSellErr
      }

      const userIdsSell = subsSell.map((row) => row.user_id)
      console.log('👥 Number of subscribers found:', userIdsSell.length)

      if (userIdsSell.length > 0) {
        // 1.a Get their email addresses
        const usersSell = await fetchEmails(userIdsSell)
        const validEmailsSell = usersSell
          .map((u) => u.email)
          .filter((e): e is string => typeof e === 'string')

        if (validEmailsSell.length > 0) {
          const notificationTitle = `Listing ${listingId} sold!`
          const notificationMessage = `Congratulations: the listing ${listingId} you were following has just been sold.`

          console.log('📨 Message prepared:', { title: notificationTitle, message: notificationMessage })
          console.log('📧 Sending emails to subscribers...')

          // Send emails, one for each recipient
          const emailResults = await Promise.allSettled(
            validEmailsSell.map((to) => {
              const emailContent = emailTemplates.listingSold(
                `${brandName} ${modelName}`
              )
              return sendEmail({
                to,
                ...emailContent
              })
            })
          )

          // Count failures
          totalEmailsSent += validEmailsSell.length
          totalEmailsFailed += emailResults.filter((r) => r.status === 'rejected').length

          if (totalEmailsFailed > 0) {
            console.log('⚠️ Failed emails (sale):', totalEmailsFailed)
          }

          // 1.b Insert into "notifications" table (in-app)
          await Promise.all(
            userIdsSell.map((uid) =>
              supabaseAdmin.from('notifications').insert({
                user_id: uid,
                listing_id: listingId,
                type: 'sold_listing',
                title: notificationTitle,
                message: notificationMessage,
              })
            )
          )
        }
      }
    }

    // 2. HANDLE "PRICE DROP"
    if (newPrice < oldPrice) {
      console.log('📉 Price drop detected, searching subscribers...')
      // Get all user_ids following this listing
      const { data: subsPrice, error: subsPriceErr } = await supabaseAdmin
        .from('listing_subscriptions')
        .select('user_id')
        .eq('listing_id', listingId)

      if (subsPriceErr) {
        console.error('❌ Error finding subscribers:', subsPriceErr)
        throw subsPriceErr
      }

      const userIdsPrice = subsPrice.map((row) => row.user_id)
      console.log('👥 Number of subscribers found:', userIdsPrice.length)

      if (userIdsPrice.length > 0) {
        // 2.a Get their email addresses
        const usersPrice = await fetchEmails(userIdsPrice)
        const validEmailsPrice = usersPrice
          .map((u) => u.email)
          .filter((e): e is string => typeof e === 'string')

        if (validEmailsPrice.length > 0) {
          const notificationTitlePrice = `Price drop for ${listingId}`
          const notificationMessagePrice = `The price has changed from ${(oldPrice)} € to ${(newPrice)} €.`

          console.log('📨 Message prepared:', { title: notificationTitlePrice, message: notificationMessagePrice })
          console.log('📧 Sending emails to subscribers...')

          // Send "price drop" emails
          const emailResults = await Promise.allSettled(
            validEmailsPrice.map((to) => {
              const listingTitle = `${brandName} ${modelName}`
              const emailContent = emailTemplates.priceUpdate(
                listingTitle,
                newPrice,
                'EUR',
                oldPrice
              )
              return sendEmail({
                to,
                ...emailContent
              })
            })
          )

          totalEmailsSent += validEmailsPrice.length
          totalEmailsFailed += emailResults.filter((r) => r.status === 'rejected').length

          if (totalEmailsFailed > 0) {
            console.log('⚠️ Failed emails (price drop):', totalEmailsFailed)
          }

          // 2.b Insert into "notifications" table (in-app)
          await Promise.all(
            userIdsPrice.map((uid) =>
              supabaseAdmin.from('notifications').insert({
                user_id: uid,
                listing_id: listingId,
                type: 'price_drop',
                title: notificationTitlePrice,
                message: notificationMessagePrice,
              })
            )
          )
        }
      }
    }

    const stats = {
      wasSold,
      priceChanged: newPrice !== oldPrice,
      emailsSent: totalEmailsSent,
      emailsFailed: totalEmailsFailed,
    }
    console.log('✅ Webhook completed successfully:', stats)

    return NextResponse.json({
      ok: true,
      stats,
    })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
} 
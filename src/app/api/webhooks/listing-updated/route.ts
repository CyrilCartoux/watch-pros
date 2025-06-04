import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import webpush from 'web-push'
import { headers } from 'next/headers'

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error('Missing VAPID keys')
}

webpush.setVapidDetails(
  'mailto:you@your-domain.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export async function POST(request: Request) {
  console.log('📥 Webhook listing-updated received')
  console.log('request.headers', request.headers)
  const signature = request.headers.get('x-supabase-signature')
  console.log('🔑 Signature received:', signature?.substring(0, 10) + '...')

  if (signature !== process.env.WEBHOOK_SECRET_UPDATE) {
    console.error('❌ Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    console.log('payload', payload)
    const oldRecord = payload.old_record
    const newRecord = payload.record

    if (!oldRecord || !newRecord) {
      console.error('❌ Incomplete payload')
      return NextResponse.json({ error: 'Incomplete payload' }, { status: 400 })
    }

    const listingId = newRecord.id
    const oldPrice = oldRecord.price
    const newPrice = newRecord.price
    const wasSold = oldRecord.status !== 'sold' && newRecord.status === 'sold'
    console.log('🔄 Changes detected:', { 
      listingId,
      oldPrice,
      newPrice,
      wasSold,
      priceChanged: newPrice !== oldPrice,
      priceDiff: newPrice - oldPrice,
      oldStatus: oldRecord.status,
      newStatus: newRecord.status
    })

    // 1. Handle sale (status changed to "sold")
    if (wasSold) {
      console.log('💰 Listing sold, searching subscribers...')
      const { data: listingSubs, error: lsErr } = await supabaseAdmin
        .from('listing_subscriptions')
        .select('user_id')
        .eq('listing_id', listingId)
      if (lsErr) {
        console.error('❌ Error finding subscribers:', lsErr)
        throw lsErr
      }

      const userIds = listingSubs.map((row) => row.user_id)
      console.log('👥 Number of subscribers found:', userIds.length)
      
      if (userIds.length > 0) {
        const { data: pushSubs, error: pushErr } = await supabaseAdmin
          .from('push_subscriptions')
          .select('*')
          .in('user_id', userIds)
        if (pushErr) {
          console.error('❌ Error finding push subscriptions:', pushErr)
          throw pushErr
        }
        console.log('📱 Number of push subscriptions found:', pushSubs?.length || 0)

        const title = `Watch you were following was sold!`
        const message = `Oops! The watch you were following (${listingId}) has just been sold.`
        console.log('📨 Message prepared:', { title, message })

        console.log('🚀 Sending push notifications...')
        await Promise.all(
          pushSubs.map((ps) =>
            webpush
              .sendNotification(
                {
                  endpoint: ps.endpoint,
                  keys: { p256dh: ps.p256dh, auth: ps.auth },
                },
                JSON.stringify({ title, message, url: `/listings/${listingId}` })
              )
              .catch((err) => {
                console.error('❌ Error sending notification:', err)
                return null
              })
          )
        )

        console.log('💾 Creating in-app notifications...')
        await Promise.all(
          userIds.map((uid) =>
            supabaseAdmin.from('notifications').insert({
              user_id: uid,
              listing_id: listingId,
              type: 'sold_listing',
              title,
              message,
            })
          )
        )
      }
    }

    // 2. Handle price drop (newPrice < oldPrice)
    if (newPrice < oldPrice) {
      console.log('📉 Price drop detected, searching subscribers...')
      const { data: listingSubs2, error: lsErr2 } = await supabaseAdmin
        .from('listing_subscriptions')
        .select('user_id')
        .eq('listing_id', listingId)
      if (lsErr2) {
        console.error('❌ Error finding subscribers:', lsErr2)
        throw lsErr2
      }

      const userIds2 = listingSubs2.map((row) => row.user_id)
      console.log('👥 Number of subscribers found:', userIds2.length)
      
      if (userIds2.length > 0) {
        const { data: pushSubs2, error: pushErr2 } = await supabaseAdmin
          .from('push_subscriptions')
          .select('*')
          .in('user_id', userIds2)
        if (pushErr2) {
          console.error('❌ Error finding push subscriptions:', pushErr2)
          throw pushErr2
        }
        console.log('📱 Number of push subscriptions found:', pushSubs2?.length || 0)

        const titlePrice = `Price drop alert!`
        const messagePrice = `The watch you're following has dropped from ${(oldPrice / 100).toLocaleString()} € to ${(newPrice / 100).toLocaleString()} €.`
        console.log('📨 Message prepared:', { title: titlePrice, message: messagePrice })

        console.log('🚀 Sending push notifications...')
        await Promise.all(
          pushSubs2.map((ps) =>
            webpush
              .sendNotification(
                {
                  endpoint: ps.endpoint,
                  keys: { p256dh: ps.p256dh, auth: ps.auth },
                },
                JSON.stringify({ title: titlePrice, message: messagePrice, url: `/listings/${listingId}` })
              )
              .catch((err) => {
                console.error('❌ Error sending notification:', err)
                return null
              })
          )
        )

        console.log('💾 Creating in-app notifications...')
        await Promise.all(
          userIds2.map((uid) =>
            supabaseAdmin.from('notifications').insert({
              user_id: uid,
              listing_id: listingId,
              type: 'price_drop',
              title: titlePrice,
              message: messagePrice,
            })
          )
        )
      }
    }

    console.log('✅ Webhook completed successfully')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
} 
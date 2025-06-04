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
  console.log('📥 Webhook listing-created received')
  console.log('request.headers', request.headers)
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

    const newListing = {
      id: record.id,
      brand: record.brand,
      model: record.model,
      price: record.price,
    }
    console.log('🏷️ New listing:', newListing)

    // 1. Find model subscribers
    console.log('🔍 Searching subscribers for model:', newListing.model)
    const { data: subs, error: subErr } = await supabaseAdmin
      .from('model_subscriptions')
      .select('user_id')
      .eq('model', newListing.model)

    if (subErr) {
      console.error('❌ Error finding subscribers:', subErr)
      throw subErr
    }
    if (!subs?.length) {
      console.log('ℹ️ No subscribers for this model')
      return NextResponse.json({ ok: true, info: 'No subscribers for this model' })
    }
    console.log('👥 Number of subscribers found:', subs.length)

    // 2. Get push subscriptions
    const userIds = subs.map(row => row.user_id)
    console.log('🔑 Searching push subscriptions for', userIds.length, 'users')
    const { data: pushSubs, error: pushErr } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds)

    if (pushErr) {
      console.error('❌ Error finding push subscriptions:', pushErr)
      throw pushErr
    }
    console.log('📱 Number of push subscriptions found:', pushSubs?.length || 0)

    // 3. Prepare message
    const title = `New watch alert: ${newListing.brand} ${newListing.model}`
    const message = `A new watch you might be interested in is now available for ${(newListing.price / 100).toLocaleString()} €.`
    console.log('📨 Message prepared:', { title, message })

    // 4. Send push notifications
    console.log('🚀 Sending push notifications...')
    const pushResults = await Promise.allSettled(
      pushSubs.map(ps =>
        webpush.sendNotification(
          {
            endpoint: ps.endpoint,
            keys: { p256dh: ps.p256dh, auth: ps.auth },
          },
          JSON.stringify({
            title,
            message,
            url: `/listings/${newListing.id}`,
          })
        )
      )
    )

    // 5. Handle push errors
    const failedPushes = pushResults
      .map((result, index) => result.status === 'rejected' ? pushSubs[index] : null)
      .filter(Boolean)

    if (failedPushes.length > 0) {
      console.log('⚠️ Failed pushes:', failedPushes.length, 'notifications')
      console.log('🗑️ Removing invalid subscriptions...')
      await supabaseAdmin
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedPushes.map(ps => ps.endpoint))
    }

    // 6. Create in-app notifications
    console.log('💾 Creating in-app notifications...')
    await supabaseAdmin.from('notifications').insert(
      userIds.map(uid => ({
        user_id: uid,
        listing_id: newListing.id,
        model: newListing.model,
        type: 'new_listing',
        title,
        message,
      }))
    )

    const stats = {
      totalSubscribers: userIds.length,
      pushSent: pushSubs.length - failedPushes.length,
      pushFailed: failedPushes.length
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
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailTemplates } from '@/lib/email'
import { CustomAlert } from '@/types/db/notifications/CustomAlerts'
import { watchConditions } from '@/data/watch-conditions'
import { includedOptions } from '@/data/watch-properties'
import { countries } from '@/data/form-options'

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
  brand_id: string
  model_id: string
  seller_id: string
  listing_type: string
  brands: {
    label: string
  }
  models: {
    label: string
  }
}

// webpush.setVapidDetails(
//   'mailto:you@your-domain.com',
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// )

// Utility function to fetch emails from a list of user_ids
async function fetchEmails(userIds: string[]): Promise<Profile[]> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .in('id', userIds)

  if (error) throw error
  return data || []
}

export async function POST(request: Request) {
  console.log('📥 Webhook listing-created received')
  const signature = request.headers.get('x-supabase-signature')

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
        brand_id,
        listing_type,
        model_id,
        seller_id,
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

    let totalAlerts = 0
    let emailsSent = 0
    let emailsFailed = 0

    // Get seller's location
    const { data: sellerAddr, error: addrError } = await supabaseAdmin
      .from('seller_addresses')
      .select('country')
      .eq('seller_id', listingDetails.seller_id)
      .single()

    if (addrError) {
      console.warn('⚠️ Could not fetch seller location:', addrError)
    }

    const country = sellerAddr?.country ?? null

    // Build filter for custom alerts based on listing type
    const { data: rawAlerts, error: alertError } = await supabaseAdmin
      .from('custom_alerts')
      .select('id, user_id, brand_id, model_id, reference, max_price, location, dial_color, type, accessory_type')
      .or(`and(brand_id.eq.${listingDetails.brand_id},model_id.eq.${listingDetails.model_id}),and(brand_id.eq.${listingDetails.brand_id},model_id.is.null),and(brand_id.is.null,model_id.eq.${listingDetails.model_id})`)

    if (alertError) {
      console.error('❌ Error fetching custom alerts:', alertError)
      throw alertError
    }

    if (!rawAlerts?.length) {
      console.log('ℹ️ No matching custom alerts found')
    } else {
      // Filter alerts by additional criteria
      const matchingAlerts = rawAlerts.filter(alert => {
        // Check if alert type matches listing type
        if (alert.type && alert.type !== listingDetails.listing_type) {
          return false
        }
        
        // For accessories, check accessory_type if specified
        if (listingDetails.listing_type === 'accessory' && alert.accessory_type) {
          if (alert.accessory_type !== record.accessory_type) {
            return false
          }
        }
        
        // For watches, check dial_color if specified
        if (listingDetails.listing_type === 'watch' && alert.dial_color) {
          if (alert.dial_color !== record.dial_color) {
            return false
          }
        }
        
        // Check reference if specified
        if (alert.reference && alert.reference !== listingDetails.reference) {
          return false
        }
        
        // Check location if specified
        if (alert.location) {
          const targetLoc = alert.location.toLowerCase()
          const countryMatch = country?.toLowerCase().includes(targetLoc)
          if (!countryMatch) {
            return false
          }
        }
        
        // Check max price if specified
        if (alert.max_price && listingDetails.price > alert.max_price) {
          return false
        }
        
        return true
      })

      if (matchingAlerts.length > 0) {
        totalAlerts = matchingAlerts.length
        console.log(`👥 ${totalAlerts} matching custom alerts found`)

        // Get unique user IDs
        const userIdsSet = new Set(matchingAlerts.map(a => a.user_id))
        const userIds = Array.from(userIdsSet)

        // Get user emails
        const users = await fetchEmails(userIds)
        const validEmails = users
          .map((u: Profile) => u.email)
          .filter((e): e is string => typeof e === 'string')

        if (validEmails.length > 0) {
          // Send emails
          console.log('📧 Sending emails for custom alerts...')
          const conditionLabel = listingDetails.condition ? watchConditions.find(c => c.slug === listingDetails.condition)?.label : null
          const includedLabel = listingDetails.included ? includedOptions.find(i => i.id === listingDetails.included)?.title : null

          const emailResults = await Promise.allSettled(
            validEmails.map((to: string) => {
              const emailContent = emailTemplates.newWatchMatch(
                brandName,
                modelName,
                listingDetails.title,
                listingDetails.reference,
                listingDetails.description,
                listingDetails.year,
                listingDetails.price,
                listingDetails.currency,
                conditionLabel || null,
                includedLabel || null,
                countries.find(c => c.value === country)?.label || null
              )
              return sendEmail({
                to,
                ...emailContent
              })
            })
          )

          const failedEmails = emailResults
            .map((result: PromiseSettledResult<any>, index: number) => result.status === 'rejected' ? validEmails[index] : null)
            .filter(Boolean)

          emailsSent += validEmails.length - failedEmails.length
          emailsFailed += failedEmails.length

          if (failedEmails.length > 0) {
            console.log('⚠️ Failed custom alert emails:', failedEmails.length, 'emails')
          }

          // Create in-app notifications
          console.log('💾 Creating in-app notifications for custom alerts...')
          const notificationTitle = `New listing matching your criteria`
          const notificationMessage = `A new ${brandName} ${modelName} (ref ${listingDetails.reference}) has been listed for ${listingDetails.price.toLocaleString()} ${listingDetails.currency}.`

          await supabaseAdmin.from('notifications').insert(
            userIds.map(uid => ({
              user_id: uid,
              listing_id: listingId,
              type: 'new_listing',
              title: notificationTitle,
              message: notificationMessage,
            }))
          )
        }
      }
    }

    const stats = {
      totalAlerts,
      emailsSent,
      emailsFailed
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
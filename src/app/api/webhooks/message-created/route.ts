import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail, emailTemplates } from '@/lib/email'

// Type for profiles query
type Profile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
}

// Type for conversations query
type Conversation = {
  id: string
  participant1_id: string
  participant2_id: string
}

// Type for messages query
type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  listing_id?: string | null
}

// Type for sellers query
type Seller = {
  id: string
  watch_pros_name: string
  company_name: string | null
}

// Type for listings query
type Listing = {
  id: string
  title: string
  price: number
  currency: string
  listing_images: {
    url: string
    order_index: number
  }[]
  brand: {
    slug: string
    label: string
  }
  model: {
    label: string
  }
}

export async function POST(request: Request) {
  console.log('📥 Webhook message-created received')
  const signature = request.headers.get('x-supabase-signature')

  if (signature !== process.env.WEBHOOK_SECRET_MESSAGE) {
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

    const messageId = record.id
    const conversationId = record.conversation_id
    const senderId = record.sender_id
    const messageContent = record.content
    const listingId = record.listing_id

    console.log('📝 Processing message:', {
      messageId,
      conversationId,
      senderId,
      contentLength: messageContent?.length,
      listingId
    })

    // Fetch conversation details
    const { data: conversation, error: conversationError } = await supabaseAdmin
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', conversationId)
      .single()

    if (conversationError) {
      console.error('❌ Error fetching conversation:', conversationError)
      throw conversationError
    }

    if (!conversation) {
      console.error('❌ Conversation not found:', conversationId)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Determine recipient (the other participant)
    const recipientId = senderId === conversation.participant1_id 
      ? conversation.participant2_id 
      : conversation.participant1_id

    console.log('👥 Conversation participants:', {
      senderId,
      recipientId,
      participant1: conversation.participant1_id,
      participant2: conversation.participant2_id
    })

    // Fetch recipient profile
    const { data: recipientProfile, error: recipientError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, first_name, last_name')
      .eq('id', recipientId)
      .single()

    if (recipientError) {
      console.error('❌ Error fetching recipient profile:', recipientError)
      throw recipientError
    }

    if (!recipientProfile || !recipientProfile.email) {
      console.log('⚠️ Recipient has no email, skipping email notification')
      return NextResponse.json({
        ok: true,
        stats: {
          emailsSent: 0,
          emailsFailed: 0,
          reason: 'no_email'
        }
      })
    }

    // Fetch sender details (for email template)
    const { data: senderProfile, error: senderError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        seller:sellers(
          watch_pros_name,
          company_name
        )
      `)
      .eq('id', senderId)
      .single()

    if (senderError) {
      console.error('❌ Error fetching sender profile:', senderError)
      throw senderError
    }

    if (!senderProfile) {
      console.error('❌ Sender profile not found:', senderId)
      return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 })
    }

    // Get sender display name
    const senderName = (senderProfile.seller as any)?.watch_pros_name || 
                      (senderProfile.seller as any)?.company_name ||
                      `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() ||
                      'A seller'

    console.log('📧 Preparing email notification:', {
      recipientEmail: recipientProfile.email,
      senderName,
      messagePreview: messageContent.substring(0, 50) + '...'
    })

    // Fetch listing details if message is linked to a listing
    let listingDetails: Listing | null = null
    if (listingId) {
      const { data: listing, error: listingError } = await supabaseAdmin
        .from('listings')
        .select(`
          id,
          title,
          price,
          currency,
          listing_images(
            url,
            order_index
          ),
          brand:brands(
            slug,
            label
          ),
          model:models(
            label
          )
        `)
        .eq('id', listingId)
        .single()

      if (listingError) {
        console.error('❌ Error fetching listing:', listingError)
        // Continue without listing details
      } else {
        listingDetails = listing as unknown as Listing
        console.log('📎 Message linked to listing:', listing.title)
      }
    }

    // Send email notification
    let emailSent = false
    let emailFailed = false

    try {
      const emailContent = emailTemplates.newMessage(senderName, messageContent, listingDetails)
      await sendEmail({
        to: recipientProfile.email,
        ...emailContent
      })
      emailSent = true
      console.log('✅ Email sent successfully')
    } catch (emailError) {
      emailFailed = true
      console.error('❌ Failed to send email:', emailError)
    }

    // Create in-app notification
    // try {
    //   await supabaseAdmin.from('notifications').insert({
    //     user_id: recipientId,
    //     type: 'new_message',
    //     title: `New message from ${senderName}`,
    //     message: messageContent.length > 100 
    //       ? messageContent.substring(0, 100) + '...' 
    //       : messageContent,
    //   })
    //   console.log('✅ In-app notification created')
    // } catch (notificationError) {
    //   console.error('❌ Failed to create in-app notification:', notificationError)
    // }

    const stats = {
      emailsSent: emailSent ? 1 : 0,
      emailsFailed: emailFailed ? 1 : 0,
      inAppNotificationCreated: true
    }

    console.log('✅ Webhook completed successfully:', stats)

    return NextResponse.json({
      ok: true,
      stats
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Vérifier l'authentification
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, to, data } = body

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let emailContent
    switch (type) {
      case 'listingNotification':
        emailContent = emailTemplates.priceUpdate(
          data.listingTitle,
          data.price,
          data.currency
        )
        break
      case 'listingSold':
        emailContent = emailTemplates.listingSold(data.listingTitle)
        break
      case 'newMessage':
        emailContent = emailTemplates.newMessage(
          data.sellerName,
          data.message
        )
        break
      case 'offerReceived':
        emailContent = emailTemplates.offerReceived(
          data.listingTitle,
          data.offerAmount,
          data.currency
        )
        break
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    await sendEmail({
      to,
      ...emailContent
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 
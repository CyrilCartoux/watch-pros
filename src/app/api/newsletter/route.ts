import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Schema de validation pour l'email
const emailSchema = z.object({
  email: z.string().email('Invalid email address')
})

export async function GET() {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Récupérer tous les abonnés actifs
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError)
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Parser et valider le body
    const body = await request.json()
    const result = emailSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Vérifier si l'email existe déjà
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking existing subscriber:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing subscription' },
        { status: 500 }
      )
    }

    // Si l'abonné existe déjà
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        )
      } else {
        // Réactiver l'abonnement
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ status: 'active' })
          .eq('id', existingSubscriber.id)

        if (updateError) {
          console.error('Error reactivating subscription:', updateError)
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          message: 'Subscription reactivated successfully'
        })
      }
    }

    // Créer un nouvel abonnement
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        status: 'active'
      })

    if (insertError) {
      console.error('Error creating subscription:', insertError)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
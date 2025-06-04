import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const Schema = z.object({
  model_id: z.string().uuid('Invalid model ID'),
})

export async function GET() {
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

    // Get user's model subscriptions with model and brand details
    const { data: subscriptions, error: subError } = await supabase
      .from('model_subscriptions')
      .select(`
        id,
        created_at,
        model:models (
          id,
          slug,
          label,
          popular,
          brand:brands (
            id,
            slug,
            label,
            popular
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (subError) {
      console.error('Error fetching subscriptions:', subError)
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriptions })
  } catch (err) {
    console.error('Unexpected error in get-subscriptions:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const parse = Schema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { model_id } = parse.data
    
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 3. Verify model exists
    const { data: model, error: modelErr } = await supabaseAdmin
      .from('models')
      .select('id')
      .eq('id', model_id)
      .single()

    if (modelErr || !model) {
      console.log('Model not found')
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // 4. Create subscription
    const { error: subErr } = await supabaseAdmin
      .from('model_subscriptions')
      .upsert({
        user_id: user.id,
        model_id,
      })

    if (subErr) {
      console.error('Error creating model subscription:', subErr)
      console.log('Failed to create subscription')
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in subscribe-model:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

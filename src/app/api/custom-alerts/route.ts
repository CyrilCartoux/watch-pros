import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const Schema = z.object({
  type: z.enum(['watch', 'accessory']),
  brand_id: z.string().uuid('Invalid brand ID').optional().nullable(),
  model_id: z.string().uuid('Invalid model ID').optional().nullable(),
  reference: z.string().optional().nullable(),
  max_price: z.number().min(0).optional().nullable(),
  location: z.string().optional().nullable(),
  dial_color: z.string().optional().nullable(),
  accessory_type: z.string().optional().nullable(),
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

    // Get user's custom alerts with brand and model details
    const { data: alerts, error: alertsError } = await supabase
      .from('custom_alerts')
      .select(`
        id,
        created_at,
        type,
        brand_id,
        model_id,
        reference,
        max_price,
        location,
        dial_color,
        accessory_type,
        brand:brands (
          id,
          slug,
          label
        ),
        model:models (
          id,
          slug,
          label
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError)
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ alerts })
  } catch (err) {
    console.error('Unexpected error in get-alerts:', err)
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
    // Transform all "" to null
    Object.keys(body).forEach(key => {
      if (body[key] === "") body[key] = null;
    });
    const parse = Schema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { type, brand_id, model_id, reference, max_price, location, dial_color, accessory_type } = parse.data
    
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Create alert
    const { error: alertErr } = await supabaseAdmin
      .from('custom_alerts')
      .upsert({
        user_id: user.id,
        type,
        brand_id,
        model_id,
        reference,
        max_price,
        location,
        dial_color,
        accessory_type,
      })

    if (alertErr) {
      console.error('Error creating custom alert:', alertErr)
      return NextResponse.json(
        { error: 'Failed to create alert' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in create-alert:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const parse = z.object({
      id: z.string()
    }).safeParse(body)
    
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { id } = parse.data
    
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Delete alert
    const { error: deleteErr } = await supabaseAdmin
      .from('custom_alerts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteErr) {
      console.error('Error deleting custom alert:', deleteErr)
      return NextResponse.json(
        { error: 'Failed to delete alert' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in delete-alert:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
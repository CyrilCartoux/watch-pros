import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BatchReadSchema = z.object({
  ids: z.array(z.number()).min(1, 'At least one notification ID is required')
})

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mark notification as read
    const { error: updateErr } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own notifications

    if (updateErr) {
      console.error('Error marking notification as read:', updateErr)
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in mark-notification-read:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const parse = BatchReadSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { ids } = parse.data

    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mark notifications as read
    const { error: updateErr } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .in('id', ids)
      .eq('user_id', user.id) // Ensure user can only update their own notifications

    if (updateErr) {
      console.error('Error marking notifications as read:', updateErr)
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in batch-mark-notifications-read:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
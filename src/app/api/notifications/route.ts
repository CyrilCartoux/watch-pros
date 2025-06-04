import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NotificationType } from '@/types/db/notifications/Notifications'

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

    // Get user's notifications with listing and model details
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select(`
        id,
        type,
        title,
        message,
        is_read,
        created_at,
        listing:listings (
          id,
          title,
          price,
          currency,
          status,
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
        ),
        model:models (
          id,
          slug,
          label,
          brand:brands (
            id,
            slug,
            label
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (notifError) {
      console.error('Error fetching notifications:', notifError)
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notifications })
  } catch (err) {
    console.error('Unexpected error in get-notifications:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
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

    // Delete notification
    const { error: deleteErr } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own notifications

    if (deleteErr) {
      console.error('Error deleting notification:', deleteErr)
      return NextResponse.json(
        { error: 'Failed to delete notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in delete-notification:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
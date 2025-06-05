import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

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

    // Get count of unread notifications
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (countError) {
      console.error('Error getting unread notifications count:', countError)
      return NextResponse.json(
        { error: 'Failed to get unread notifications count' },
        { status: 500 }
      )
    }

    return NextResponse.json({ count: count || 0 })
  } catch (err) {
    console.error('Unexpected error in get-unread-notifications-count:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
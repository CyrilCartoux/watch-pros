import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get newsletter subscribers
    const { data: newsletterData, error: newsletterError } = await supabase
      .rpc('get_newsletter_subscribers', { 
        limit_count: limit, 
        offset_count: offset 
      })

    if (newsletterError) {
      console.error('Error fetching newsletter subscribers:', newsletterError)
      return NextResponse.json({ error: 'Failed to fetch newsletter subscribers' }, { status: 500 })
    }

    return NextResponse.json(newsletterData)

  } catch (error) {
    console.error('Admin newsletter error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
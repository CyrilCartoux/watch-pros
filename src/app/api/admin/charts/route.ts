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
    const metric = searchParams.get('metric') || 'listings'
    const period = searchParams.get('period') || 'month'

    // Get time series data
    const { data: timeSeriesData, error: timeSeriesError } = await supabase
      .rpc('get_time_series_data', { 
        metric: metric, 
        period: period 
      })

    if (timeSeriesError) {
      console.error('Error fetching time series data:', timeSeriesError)
      return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
    }

    return NextResponse.json({
      data: timeSeriesData,
      metric,
      period
    })

  } catch (error) {
    console.error('Admin charts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
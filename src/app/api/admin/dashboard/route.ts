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

    // Get period from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'all'

    // Get main dashboard stats
    const { data: stats, error: statsError } = await supabase
      .rpc('get_admin_dashboard_stats', { period_type: period })

    if (statsError) {
      console.error('Error fetching dashboard stats:', statsError)
      return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 })
    }

    // Get top brands and models
    const { data: brandsModels, error: brandsError } = await supabase
      .rpc('get_top_brands_models')

    if (brandsError) {
      console.error('Error fetching brands/models:', brandsError)
      return NextResponse.json({ error: 'Failed to fetch brands and models data' }, { status: 500 })
    }

    return NextResponse.json({
      stats,
      brandsModels
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 
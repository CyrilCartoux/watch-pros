import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Profile } from '@/types/db/Profiles'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

// Add cache configuration
export const runtime = 'edge'
export const preferredRegion = 'auto'

// Add cache headers
const CACHE_TTL = 60 // 60 seconds
const CACHE_STALE_WHILE_REVALIDATE = 300 // 5 minutes

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        email,
        seller_id
      `)
      .eq('id', params.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      if (profileError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Add cache control headers
    const response = NextResponse.json(
      profile,
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        },
      }
    )

    return response
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/sellers/[id]/stats
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Récupérer les statistiques du vendeur
    const { data: stats, error: statsError } = await supabase
      .from('seller_stats')
      .select('*')
      .eq('seller_id', params.id)
      .single()

    if (statsError) {
      console.error('Error fetching stats:', statsError)
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      )
    }

    // Si les stats n'existent pas, les calculer
    if (!stats) {
      // Récupérer les reviews
      const { data: reviews } = await supabase
        .from('seller_reviews')
        .select('rating')
        .eq('seller_id', params.id)

      // Récupérer les approbations
      const { data: approvals } = await supabase
        .from('seller_approvals')
        .select('is_verified')
        .eq('seller_id', params.id)

      // Calculer les statistiques
      const calculatedStats = {
        seller_id: params.id,
        total_reviews: reviews?.length || 0,
        average_rating: reviews?.length 
          ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
          : 0,
        total_approvals: approvals?.length || 0,
        verified_approvals: approvals?.filter(a => a.is_verified).length || 0,
        last_updated: new Date().toISOString()
      }

      // Insérer les statistiques
      const { data: newStats, error: insertError } = await supabase
        .from('seller_stats')
        .insert(calculatedStats)
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting stats:', insertError)
        return NextResponse.json(
          { error: 'Failed to create stats' },
          { status: 500 }
        )
      }

      return NextResponse.json(newStats)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/sellers/[id]/approvals
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Récupérer les approbations du vendeur
    const { data: approvals, error: approvalsError } = await supabase
      .from('seller_approvals')
      .select(`
        *,
        approver:approver_id (
          first_name,
          last_name
        )
      `)
      .eq('seller_id', params.id)
      .order('created_at', { ascending: false })

    if (approvalsError) {
      console.error('Error fetching approvals:', approvalsError)
      return NextResponse.json(
        { error: 'Failed to fetch approvals' },
        { status: 500 }
      )
    }

    return NextResponse.json(approvals)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/sellers/[id]/approvals
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Vérifier si le vendeur existe
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id')
      .eq('id', params.id)
      .single()

    if (sellerError || !seller) {
      console.error('Seller error:', sellerError)
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('User ID:', user.id)
    console.log('Seller ID:', params.id)

    // Vérifier si l'utilisateur a déjà approuvé ce vendeur
    const { data: existingApproval, error: checkError } = await supabase
      .from('seller_approvals')
      .select('id')
      .eq('seller_id', params.id)
      .eq('approver_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing approval:', checkError)
      return NextResponse.json(
        { error: 'Failed to check existing approval' },
        { status: 500 }
      )
    }

    if (existingApproval) {
      return NextResponse.json(
        { error: 'You have already approved this seller' },
        { status: 400 }
      )
    }

    // Créer l'approval avec les données complètes
    const { data: approval, error: approvalError } = await supabase
      .from('seller_approvals')
      .insert({
        seller_id: params.id,
        approver_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (approvalError) {
      console.error('Error creating approval:', approvalError)
      console.error('Error details:', {
        code: approvalError.code,
        message: approvalError.message,
        details: approvalError.details,
        hint: approvalError.hint
      })
      return NextResponse.json(
        { error: 'Failed to create approval' },
        { status: 500 }
      )
    }

    return NextResponse.json(approval)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/sellers/[id]/approvals
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Supprimer l'approbation
    const { error: deleteError } = await supabase
      .from('seller_approvals')
      .delete()
      .eq('seller_id', params.id)
      .eq('approver_id', user.id)

    if (deleteError) {
      console.error('Error deleting approval:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete approval' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
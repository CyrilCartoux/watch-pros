import { createClient } from '@/lib/supabase/server'
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchId = params.id

    // First, check if the active search belongs to the current user
    const { data: existingSearch, error: fetchError } = await supabase
      .from('active_searches')
      .select('id, user_id')
      .eq('id', searchId)
      .single()

    if (fetchError || !existingSearch) {
      return NextResponse.json({ error: "Active search not found" }, { status: 404 })
    }

    if (existingSearch.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete the active search
    const { error: deleteError } = await supabase
      .from('active_searches')
      .delete()
      .eq('id', searchId)

    if (deleteError) {
      console.error('Error deleting active search:', deleteError)
      return NextResponse.json({ error: "Failed to delete active search" }, { status: 500 })
    }

    return NextResponse.json({ message: "Active search deleted successfully" })

  } catch (error) {
    console.error('Error in DELETE /api/search/[id]:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
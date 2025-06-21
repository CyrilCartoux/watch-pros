import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const MarkReadSchema = z.object({
  messageIds: z.array(z.string()).min(1, 'At least one message ID is required')
})

export async function POST(request: Request) {
  console.log('=== POST /api/messages/mark-read called ===')
  
  try {
    // Parse and validate request body
    const body = await request.json()
    console.log('Request body:', body)
    
    const parse = MarkReadSchema.safeParse(body)
    if (!parse.success) {
      console.log('Validation error:', parse.error.format())
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { messageIds } = parse.data

    console.log('Message IDs to mark as read:', messageIds)

    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('User auth result:', { user: user?.id, error: userError })
    
    if (userError || !user) {
      console.log('ERROR: User not authenticated')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // First, verify that these messages belong to conversations where the user is a participant
    const { data: messages, error: fetchError } = await supabaseAdmin
      .from('messages')
      .select(`
        id,
        conversation_id,
        conversations!inner(
          participant1_id,
          participant2_id
        )
      `)
      .in('id', messageIds)

    if (fetchError) {
      console.error('Error fetching messages:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    // Filter messages that belong to conversations where the user is a participant
    const userMessageIds = messages
      .filter(msg => 
        (msg.conversations as any).participant1_id === user.id || 
        (msg.conversations as any).participant2_id === user.id
      )
      .map(msg => msg.id)

    console.log('User message IDs to update:', userMessageIds)

    if (userMessageIds.length === 0) {
      console.log('No valid messages found for user')
      return NextResponse.json({ success: true, updatedCount: 0 })
    }

    // Mark messages as read using supabaseAdmin
    const { error: updateErr } = await supabaseAdmin
      .from('messages')
      .update({ read: true })
      .in('id', userMessageIds)

    console.log('Update operation result:', { error: updateErr })

    if (updateErr) {
      console.error('Error marking messages as read:', updateErr)
      return NextResponse.json(
        { error: 'Failed to mark messages as read', details: updateErr.message },
        { status: 500 }
      )
    }

    console.log('Messages marked as read successfully')
    return NextResponse.json({ 
      success: true, 
      updatedCount: userMessageIds.length 
    })
  } catch (err) {
    console.error('Unexpected error in mark-messages-read:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 
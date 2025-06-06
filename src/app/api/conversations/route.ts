import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the profile ID of the current user
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const { otherUserId, initialMessage } = await request.json()

    if (!otherUserId || !initialMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the profile ID of the seller
    const { data: sellerProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('seller_id', otherUserId)
      .single()

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur essaie de créer une conversation avec lui-même
    if (profile.id === sellerProfile.id) {
      return NextResponse.json(
        { error: 'You cannot create a conversation with yourself' },
        { status: 400 }
      )
    }

    // Vérifier si une conversation existe déjà
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${profile.id},participant2_id.eq.${sellerProfile.id}),and(participant1_id.eq.${sellerProfile.id},participant2_id.eq.${profile.id})`)
      .single()

    let conversationId = existingConversation?.id

    // Si pas de conversation existante, en créer une nouvelle
    if (!conversationId) {
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: profile.id,
          participant2_id: sellerProfile.id
        })
        .select('id')
        .single()

      if (conversationError) throw conversationError
      conversationId = newConversation.id
    }

    // Insérer le message initial
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: profile.id,
        content: initialMessage
      })
      .select()
      .single()

    if (messageError) throw messageError

    return NextResponse.json({ 
      conversationId,
      message 
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

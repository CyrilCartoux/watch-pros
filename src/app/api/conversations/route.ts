import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    console.log('🚀 Starting conversation creation...')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('❌ No authenticated user found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.log('✅ User authenticated:', user.id)

    // Get the profile ID of the current user
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      console.log('❌ User profile not found:', user.id)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }
    console.log('✅ User profile found:', profile.id)

    const { otherUserId, initialMessage, listingId } = await request.json()
    console.log('📝 Request data:', { otherUserId, initialMessageLength: initialMessage?.length, listingId })

    if (!otherUserId || !initialMessage) {
      console.log('❌ Missing required fields:', { otherUserId: !!otherUserId, initialMessage: !!initialMessage })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the profile ID of the seller
    const { data: sellerProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('seller_id', otherUserId)
      .single()

    if (!sellerProfile) {
      console.log('❌ Seller profile not found:', otherUserId)
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      )
    }
    console.log('✅ Seller profile found:', sellerProfile.id)

    // Vérifier si l'utilisateur essaie de créer une conversation avec lui-même
    if (profile.id === sellerProfile.id) {
      console.log('❌ User trying to create conversation with self:', profile.id)
      return NextResponse.json(
        { error: 'You cannot create a conversation with yourself' },
        { status: 400 }
      )
    }

    // Vérifier si une conversation existe déjà
    console.log('🔍 Checking for existing conversation between:', { participant1: profile.id, participant2: sellerProfile.id })
    const { data: existingConversation, error: searchError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant1_id.eq.${profile.id},participant2_id.eq.${sellerProfile.id}),and(participant1_id.eq.${sellerProfile.id},participant2_id.eq.${profile.id})`)
      .single()

    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('❌ Error searching for conversation:', {
        code: searchError.code,
        message: searchError.message,
        details: searchError.details,
        hint: searchError.hint
      })
      throw searchError
    }

    let conversationId = existingConversation?.id
    console.log('📊 Existing conversation check:', { exists: !!existingConversation, id: conversationId })

    // Si pas de conversation existante, en créer une nouvelle
    if (!conversationId) {
      console.log('➕ Creating new conversation...')
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: profile.id,
          participant2_id: sellerProfile.id
        })
        .select('id')
        .single()

      if (conversationError) {
        console.error('❌ Error creating conversation:', {
          code: conversationError.code,
          message: conversationError.message,
          details: conversationError.details,
          hint: conversationError.hint,
          stack: conversationError.stack
        })
        throw conversationError
      }
      conversationId = newConversation.id
      console.log('✅ New conversation created:', conversationId)
    }

    // Insérer le message initial avec listing_id optionnel
    console.log('💬 Inserting initial message...')
    const messageData: any = {
      conversation_id: conversationId,
      sender_id: profile.id,
      content: initialMessage
    }
    
    if (listingId) {
      messageData.listing_id = listingId
      console.log('📎 Linking message to listing:', listingId)
    }

    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (messageError) {
      console.error('❌ Error inserting message:', {
        code: messageError.code,
        message: messageError.message,
        details: messageError.details,
        hint: messageError.hint,
        stack: messageError.stack
      })
      throw messageError
    }
    console.log('✅ Message inserted successfully:', message.id)

    console.log('🎉 Conversation creation completed successfully')
    return NextResponse.json({ 
      conversationId,
      message 
    })
  } catch (error) {
    const pgError = error as PostgrestError
    console.error('❌ Error in conversation creation:', {
      name: pgError.name,
      message: pgError.message,
      code: pgError.code,
      details: pgError.details,
      hint: pgError.hint,
      stack: pgError.stack
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logApiError, logApiSuccess, ErrorWithMessage } from '@/utils/logger'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json()
    // Check if user already exists
    const { data: listUsersData, error: checkError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 })
    const users = listUsersData?.users?.filter((u) => u.email?.toLowerCase() === email.toLowerCase()) || []
    const user = users[0]
    if (user?.app_metadata?.provider === 'google') {
      return NextResponse.json(
        { error: "This email address already exists and was created via Google. Please sign in with Google." },
        { status: 400 }
      )
    }
    if (checkError) {
      logApiError(checkError, 'register-check-exists', request)
      return NextResponse.json(
        { error: 'Could not check for existing user' },
        { status: 500 }
      )
    }

    if (users && users.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in or use another email.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      }
    })

    if (error) {
      logApiError(error, 'register', request)
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 400 }
      )
    }

    logApiSuccess(data, 'register')
    return NextResponse.json({ 
      data,
      message: 'Registration successful. Please check your email to verify your account.'
    })
  } catch (error) {
    logApiError(error as ErrorWithMessage, 'register', request)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}

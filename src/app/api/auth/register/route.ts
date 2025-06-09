import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logApiError, logApiSuccess, ErrorWithMessage } from '@/utils/logger'

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json()
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
      },
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

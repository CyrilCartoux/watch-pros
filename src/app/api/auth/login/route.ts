import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logApiError, logApiSuccess, ErrorWithMessage } from '@/utils/logger'
import { getCurrentDomain, getDomainUrl } from '@/utils/domain'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = await createClient()
    const domain = getCurrentDomain(request)
    const redirectUrl = getDomainUrl(domain)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      logApiError(error, 'login', request)
      return NextResponse.json(
        { error: error.message },
        { status: error.status ?? 400 }
      )
    }

    logApiSuccess(data, 'login')
    return NextResponse.json({ 
      data,
      redirectUrl // Send the domain-specific URL back to the client
    })
  } catch (error) {
    logApiError(error as ErrorWithMessage, 'login', request)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

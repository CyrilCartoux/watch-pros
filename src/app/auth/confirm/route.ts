import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  console.log('Confirmation attempt:', {
    token_hash,
    type,
    next
  })

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    console.log('Verification result:', { error })

    if (!error) {
      // Redirection vers la page d'accueil après confirmation réussie
      redirect('/')
    }
  }

  // Redirection vers la page d'erreur en cas d'échec
  redirect('/auth/auth-code-error')
} 
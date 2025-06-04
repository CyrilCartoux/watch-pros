// pages/api/subscribe-listing.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const Schema = z.object({
  listing_id: z.string().min(1),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  const parse = Schema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() })
  }
  const { listing_id } = parse.data

  // Récupérer l’utilisateur
  const token = req.headers.cookie?.split('sb:token=')[1]?.split(';')[0]
  if (!token) return res.status(401).json({ error: 'Non authentifié' })
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser(token)
  if (userErr || !user) return res.status(401).json({ error: 'Utilisateur invalide' })

  try {
    await supabaseAdmin.from('listing_subscriptions').upsert({
      user_id: user.id,
      listing_id,
    })
    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}

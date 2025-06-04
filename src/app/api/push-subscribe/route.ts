// pages/api/push-subscribe.ts  (ou app/api/push-subscribe/route.ts)
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextApiRequest, NextApiResponse } from 'next'
import webpush from 'web-push'

// Charger la clé privée VAPID depuis vos envs (jamais exposer côté client)
const VAPID_SUBJECT = 'mailto:you@your-domain.com'
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY!
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  try {
    // 1. On récupère la session Supabase pour savoir quel est l'user
    const token = req.headers.cookie?.split('sb:token=')[1]?.split(';')[0]
    if (!token) return res.status(401).json({ error: 'Non authentifié' })
    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !user) return res.status(401).json({ error: 'Utilisateur invalide' })

    // 2. Le body est l'objet PushSubscription JSON du navigateur
    const subscription = req.body as {
      endpoint: string
      keys: { p256dh: string; auth: string }
    }

    // 3. Sauvegarder dans Supabase (table push_subscriptions)
    const { data, error: insertErr } = await supabaseAdmin
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      })
      .select()
    if (insertErr) throw insertErr

    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}

'use client'

import { useEffect, useState } from 'react'

export function PushManager() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setSupported(true)
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker enregistré')
        // on peut ensuite vérifier si déjà abonné
        navigator.serviceWorker.ready.then(async (registration) => {
          const existing = await registration.pushManager.getSubscription()
          setSubscribed(!!existing)
        })
      })
    }
  }, [])

  async function subscribe() {
    if (!('serviceWorker' in navigator)) return
    const registration = await navigator.serviceWorker.ready

    // 1. Demande permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      alert("Vous n'avez pas autorisé les notifications.")
      return
    }

    // 2. S’abonner au Push
    //    Il vous faut générer vos clés VAPID/volontaire
    //    par ligne de commande : web-push generate-vapid-keys
    //    et les stocker en secrets (env) côté serveur.
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    }
    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions)

    // 3. Envoyer l’objet subscription au serveur
    await fetch('/api/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pushSubscription.toJSON()),
    })

    setSubscribed(true)
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  if (!supported) return null

  return (
    <button
      onClick={subscribe}
      disabled={subscribed}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {subscribed ? 'Déjà abonné aux notifications' : "S'abonner aux notifications"}
    </button>
  )
}

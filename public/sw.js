// public/sw.js
self.addEventListener('push', function (event) {
    let data = {}
    if (event.data) {
      data = event.data.json()
    }
    const title = data.title || 'Nouvelle notification'
    const options = {
      body: data.message || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: data.url || '/', // où rediriger l’utilisateur au clic
      },
    }
    event.waitUntil(self.registration.showNotification(title, options))
  })
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    const url = event.notification.data.url
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function (clientList) {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
    )
  })
  
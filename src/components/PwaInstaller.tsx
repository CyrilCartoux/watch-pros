"use client"
import { useEffect, useState } from "react"

export default function PwaInstaller() {
  const [promptEvent, setPromptEvent] = useState<any>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }

    const handler = (e: any) => {
      e.preventDefault()
      setPromptEvent(e)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const install = () => {
    if (!promptEvent) return
    promptEvent.prompt()
    promptEvent.userChoice.then(() => setPromptEvent(null))
  }

  if (!promptEvent) return null
  return (
    <button
      onClick={install}
      className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50"
    >
      Installer l’app
    </button>
  )
}
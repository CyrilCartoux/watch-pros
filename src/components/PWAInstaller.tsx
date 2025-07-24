"use client";
import { useEffect, useState } from "react";

const BANNER_HEIGHT = 44; // px

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Détecter mobile
    const isMobile = () => {
      if (typeof window === "undefined") return false;
      const ua = navigator.userAgent;
      const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
      console.log("[PWAInstaller] userAgent:", ua);
      console.log("[PWAInstaller] isMobile:", mobile);
      return mobile;
    };
    if (!isMobile()) {
      console.log("[PWAInstaller] Not mobile, prompt will not show.");
      return;
    }

    const handler = (e: any) => {
      console.log("[PWAInstaller] beforeinstallprompt event fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    console.log("[PWAInstaller] beforeinstallprompt event listener attached");
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      console.log("[PWAInstaller] beforeinstallprompt event listener detached");
    };
  }, []);

  // Event custom pour informer la navbar
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent('pwa-prompt-visibility', { detail: showPrompt }));
  }, [showPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    console.log("[PWAInstaller] handleInstall called");
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWAInstaller] userChoice outcome:", outcome);
    if (outcome === "accepted" || outcome === "dismissed") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) {
    console.log("[PWAInstaller] showPrompt is false, nothing rendered");
    return null;
  }

  console.log("[PWAInstaller] Rendering install prompt");

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1100] flex justify-center items-center shadow-md px-4"
      style={{ height: BANNER_HEIGHT, background: "hsl(var(--primary))" }}
    >
      <div className="flex items-center w-full max-w-md rounded-lg bg-[hsl(var(--primary))] text-white font-medium text-[15px] px-4 py-2 mx-auto shadow-lg border border-primary/30" style={{height: BANNER_HEIGHT}}>
        <span className="mr-3 truncate">Install Watch Pros® app</span>
        <button
          onClick={handleInstall}
          className="ml-auto bg-white text-[hsl(var(--primary))] font-semibold rounded px-3 py-1 text-[15px] shadow-sm border border-primary/30 hover:bg-primary/10 transition-colors"
          style={{ height: 32 }}
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="ml-2 text-white text-xl font-bold px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
          aria-label="Close"
          style={{ height: 32 }}
        >
          ×
        </button>
      </div>
    </div>
  );
} 
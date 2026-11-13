import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';
import { Button } from '../ui/Button.tsx';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // Guide user on iOS or unsupported browser
      alert(
        'To install Pata ID on your home screen:\n\n1. Tap the Share button in Safari / Chrome\n2. Select "Add to Home Screen"'
      );
    }
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in slide-in-from-bottom-3 duration-300">
      <div className="bg-[#123C30] text-white p-4 rounded-2xl shadow-2xl border border-[#146B50] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#146B50] flex items-center justify-center shrink-0 shadow-xs">
            <img src="/logo.svg" alt="Pata ID" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Install Pata ID App</p>
            <p className="text-[11px] text-[#E8F4ED]/80">
              Instant alerts & offline identity check
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="lime"
            size="sm"
            onClick={handleInstallClick}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Install
          </Button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-[#89968E] hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

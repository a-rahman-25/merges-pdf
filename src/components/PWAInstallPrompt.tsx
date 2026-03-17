import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Show after 30s
    const timer = setTimeout(() => setShow(true), 30000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    localStorage.setItem('pwa-dismissed', '1');
  };

  if (!show || !deferredPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-lg">
        <Download className="h-6 w-6 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-foreground">Install MergesPDF</p>
          <p className="text-xs text-muted-foreground">Use offline — no install needed from store</p>
        </div>
        <Button size="sm" onClick={handleInstall}>Install</Button>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

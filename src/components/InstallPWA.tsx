import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const InstallPWA: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Only show iOS hint if not already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    
    if (isIOSDevice && !isStandalone) {
      const lastShown = localStorage.getItem('ios-pwa-hint-last-shown');
      const now = Date.now();
      // Show every 24 hours
      if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
        setTimeout(() => setShowIOSHint(true), 5000);
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install prompt after some time
      const lastShown = localStorage.getItem('pwa-prompt-last-shown');
      const now = Date.now();
      if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
        setTimeout(() => setShowInstallModal(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    }
    
    setDeferredPrompt(null);
    setShowInstallModal(false);
    localStorage.setItem('pwa-prompt-last-shown', Date.now().toString());
  };

  const closeIOSHint = () => {
    setShowIOSHint(false);
    localStorage.setItem('ios-pwa-hint-last-shown', Date.now().toString());
  };

  return (
    <>
      <AnimatePresence>
        {showInstallModal && deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-4 right-4 z-[110] lg:bottom-8 lg:right-8 lg:left-auto lg:w-96"
          >
            <div className="bg-white dark:bg-[#1A120A] border border-primary/20 rounded-3xl p-6 shadow-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <img src="/logo.svg" alt="App Logo" className="w-8 h-8 invert brightness-0" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-secondary dark:text-white text-sm">Install Deener Sathi</h4>
                <p className="text-secondary/60 dark:text-white/60 text-xs mt-0.5">Add to home screen for quick access</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/90 transition-all"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="p-2.5 rounded-xl text-secondary/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIOSHint && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-4 right-4 z-[110]"
          >
            <div className="bg-white dark:bg-[#1A120A] border border-primary/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <button 
                onClick={closeIOSHint}
                className="absolute top-3 right-3 p-1 rounded-lg text-secondary/40 dark:text-white/40"
              >
                <X size={18} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <img src="/logo.svg" alt="App Logo" className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-secondary dark:text-white mb-2">Install Deener Sathi on iOS</h4>
                <div className="space-y-4 w-full">
                  <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-center gap-3 text-sm">
                    <span>Tap the</span>
                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <Share size={18} />
                    </div>
                    <span>Share button</span>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-center gap-3 text-sm">
                    <span>Select</span>
                    <div className="bg-primary/20 p-2 rounded-lg text-primary">
                      <PlusSquare size={18} />
                    </div>
                    <span>Add to Home Screen</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { getConsent, setConsent, onConsentChange } from '@/lib/consent';

const CookieConsent = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
    return onConsentChange(() => setVisible(getConsent() === null));
  }, []);

  const choose = (choice: 'accepted' | 'declined') => {
    setConsent(choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-5"
          role="dialog"
          aria-label={t('cookie.message')}
        >
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground leading-relaxed">{t('cookie.message')}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={() => choose('accepted')}>
                  {t('cookie.accept')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => choose('declined')}>
                  {t('cookie.decline')}
                </Button>
                <Link to="/privacy" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                  {t('cookie.learnMore')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

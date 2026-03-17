import { Shield, Lock, Trash2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const PrivacyNotice = () => {
  const { t } = useI18n();
  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-card/50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-foreground">{t('privacy.notice.title')}</h3>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>{t('privacy.notice.local')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              <span>{t('privacy.notice.noStore')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 shrink-0" />
              <span>{t('privacy.notice.noSignup')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;

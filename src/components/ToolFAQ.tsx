import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface FAQItem {
  q: string;
  a: string;
}

interface ToolFAQProps {
  faqs: FAQItem[];
}

const ToolFAQ = ({ faqs }: ToolFAQProps) => {
  const { t } = useI18n();
  return (
    <div className="mx-auto mt-12 max-w-2xl space-y-4">
      <h2 className="text-center font-display text-xl font-bold text-foreground md:text-2xl">
        {t('faq.heading')}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.q} className="group rounded-xl border border-border bg-card">
            <summary className="flex cursor-pointer items-center justify-between p-4 font-display text-sm font-semibold text-foreground">
              {faq.q}
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default ToolFAQ;

import { motion } from 'framer-motion';
import AIQandA from '@/components/AIQandA';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';

const AiQa = () => {
  const { t } = useI18n();
  const faqs = [
    { q: t('faq.qa.q1'), a: t('faq.qa.a1') },
    { q: t('faq.qa.q2'), a: t('faq.qa.a2') },
    { q: t('faq.qa.q3'), a: t('faq.qa.a3') },
    { q: t('faq.qa.q4'), a: t('faq.qa.a4') },
  ];
  return (
    <ToolPageLayout activeTab="ai-qa">
      <SEOHead
        title="AI PDF Q&A — Ask Questions About PDFs | MergePDF"
        description="Upload a PDF and ask questions about it. AI will analyze and answer instantly."
        path="/ai-qa"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t('ai.page.summarize.h1a')} <span className="text-primary">{t('ai.page.qa.h1b')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {t('ai.page.qa.sub')}
          </p>
        </div>
        <AIQandA />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default AiQa;

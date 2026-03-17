import { motion } from 'framer-motion';
import AISummarizer from '@/components/AISummarizer';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';

const AiSummarize = () => {
  const { t } = useI18n();
  const faqs = [
    { q: t('faq.summarize.q1'), a: t('faq.summarize.a1') },
    { q: t('faq.summarize.q2'), a: t('faq.summarize.a2') },
    { q: t('faq.summarize.q3'), a: t('faq.summarize.a3') },
    { q: t('faq.summarize.q4'), a: t('faq.summarize.a4') },
  ];
  return (
    <ToolPageLayout activeTab="ai-summarize">
      <SEOHead
        title="AI PDF Summarizer — Free | MergePDF"
        description="Upload a PDF and get an AI-generated summary instantly. Free and powered by advanced AI."
        path="/ai-summarize"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t('ai.page.summarize.h1a')} <span className="text-primary">{t('ai.page.summarize.h1b')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {t('ai.page.summarize.sub')}
          </p>
        </div>
        <AISummarizer />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default AiSummarize;

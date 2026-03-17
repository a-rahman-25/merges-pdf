import { motion } from 'framer-motion';
import AITranslator from '@/components/AITranslator';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';

const AiTranslate = () => {
  const { t } = useI18n();
  const faqs = [
    { q: t('faq.translate.q1'), a: t('faq.translate.a1') },
    { q: t('faq.translate.q2'), a: t('faq.translate.a2') },
    { q: t('faq.translate.q3'), a: t('faq.translate.a3') },
    { q: t('faq.translate.q4'), a: t('faq.translate.a4') },
  ];
  return (
    <ToolPageLayout activeTab="ai-translate">
      <SEOHead
        title="AI PDF Translator — Free | MergePDF"
        description="Translate PDF documents into any language using AI. Free and instant."
        path="/ai-translate"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t('ai.page.summarize.h1a')} <span className="text-primary">{t('ai.page.translate.h1b')}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {t('ai.page.translate.sub')}
          </p>
        </div>
        <AITranslator />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default AiTranslate;

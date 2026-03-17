import { motion } from 'framer-motion';
import AITranslator from '@/components/AITranslator';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';

const faqs = [
  { q: 'Which languages are supported?', a: 'We support 15+ languages including Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, Russian, and more.' },
  { q: 'How accurate is the translation?', a: 'Our AI provides high-quality translations suitable for general understanding. For official or legal documents, we recommend professional human translation.' },
  { q: 'Can I translate the entire PDF?', a: 'AI analyzes the document and translates the content structure. For full page-by-page translation, copy the text content and provide it for best results.' },
  { q: 'Is this free?', a: 'Yes, AI translation is free to use with generous usage limits.' },
];

const AiTranslate = () => {
  const { t } = useI18n();
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

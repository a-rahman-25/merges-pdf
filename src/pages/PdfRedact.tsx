import { motion } from 'framer-motion';
import PDFRedactor from '@/components/PDFRedactor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';
import { getTranslatedFaqs } from '@/lib/faq-translations';

const PdfRedactPage = () => {
  const { lang } = useI18n();
  const faqs = getTranslatedFaqs('redact', lang);
  return (
    <ToolPageLayout activeTab={'redact' as any}>
      <SEOHead title="Redact PDF — Black Out Sensitive Information | MergePDF" description="Redact sensitive information from PDFs by drawing black rectangles. Free, private — processed locally in your browser." path="/pdf-redact" faqs={faqs} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.redact.h1a', lang)} <span className="text-primary">{tt('page.redact.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">{tt('page.redact.sub', lang)}</p>
        </div>
        <PDFRedactor />
        <ToolFAQ toolId="redact" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfRedactPage;

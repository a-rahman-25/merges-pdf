import { motion } from 'framer-motion';
import PDFGrayscale from '@/components/PDFGrayscale';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';
import { getTranslatedFaqs } from '@/lib/faq-translations';

const Grayscale = () => {
  const { lang } = useI18n();
  const faqs = getTranslatedFaqs('grayscale', lang);
  return (
    <ToolPageLayout activeTab="grayscale">
      <SEOHead title="Convert PDF to Grayscale — Free Online | MergePDF" description="Convert color PDFs to grayscale to reduce file size. 100% free, private, and processed in your browser." path="/grayscale" faqs={faqs} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.grayscale.h1a', lang)} <span className="text-primary">{tt('page.grayscale.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">{tt('page.grayscale.sub', lang)}</p>
        </div>
        <PDFGrayscale />
        <ToolFAQ toolId="grayscale" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default Grayscale;

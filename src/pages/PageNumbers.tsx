import { motion } from 'framer-motion';
import PDFPageNumberer from '@/components/PDFPageNumberer';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';
import { getTranslatedFaqs } from '@/lib/faq-translations';

const PageNumbers = () => {
  const { lang } = useI18n();
  const faqs = getTranslatedFaqs('pageNumbers', lang);
  return (
    <ToolPageLayout activeTab="page-numbers">
      <SEOHead title="Add Page Numbers to PDF Free Online | MergesPDF" description="Add page numbers to any PDF document for free. Choose top or bottom position. No sign-up, no uploads — processed in your browser." path="/page-numbers" faqs={faqs} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.pageNumbers.h1a', lang)} <span className="text-primary">{tt('page.pageNumbers.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">{tt('page.pageNumbers.sub', lang)}</p>
        </div>
        <PDFPageNumberer />
        <ToolFAQ toolId="pageNumbers" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PageNumbers;

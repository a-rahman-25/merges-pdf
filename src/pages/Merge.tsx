import { motion } from 'framer-motion';
import PDFMerger from '@/components/PDFMerger';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const Merge = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge">
      <SEOHead
        title="Merge PDF Files Online — Free, Private, No Upload | MergePDF"
        description="Combine multiple PDF files into one document for free. Drag to reorder pages. 100% private — files never leave your browser."
        path="/merge"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.merge.h1a', lang)} <span className="text-primary">{tt('page.merge.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.merge.sub', lang)}
          </p>
        </div>
        <PDFMerger />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default Merge;

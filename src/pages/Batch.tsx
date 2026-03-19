import { motion } from 'framer-motion';
import BatchProcessor from '@/components/BatchProcessor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const Batch = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="batch">
      <SEOHead
        title="Batch PDF Processing — Free | MergePDF"
        description="Process multiple PDF files at once — batch merge, compress, and convert. Free and private."
        path="/batch"
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.batch.h1a', lang)} <span className="text-primary">{tt('page.batch.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.batch.sub', lang)}
          </p>
        </div>
        <BatchProcessor />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default Batch;

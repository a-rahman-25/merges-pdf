import { motion } from 'framer-motion';
import PDFCompressor from '@/components/PDFCompressor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const Compress = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="compress">
      <SEOHead
        title="Compress PDF Online — Reduce File Size Free | MergePDF"
        description="Compress PDF files to reduce size by stripping metadata. Free, private, no upload — everything runs in your browser."
        path="/compress"
        
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.compress.h1a', lang)} <span className="text-primary">{tt('page.compress.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.compress.sub', lang)}
          </p>
        </div>
        <PDFCompressor />
        <ToolFAQ toolId="compress" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default Compress;

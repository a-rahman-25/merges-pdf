import { motion } from 'framer-motion';
import PDFWatermarkAdder from '@/components/PDFWatermarkAdder';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const AddWatermark = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="add-watermark">
      <SEOHead
        title="Add Watermark to PDF Online — Free, Private | MergePDF"
        description="Add text watermarks to your PDF files. 100% free and private — processed locally in your browser."
        path="/add-watermark"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.watermark.h1a', lang)} <span className="text-primary">{tt('page.watermark.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.watermark.sub', lang)}
          </p>
        </div>
        <PDFWatermarkAdder />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default AddWatermark;

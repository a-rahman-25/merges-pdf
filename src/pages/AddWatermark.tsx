import { motion } from 'framer-motion';
import PDFWatermarkAdder from '@/components/PDFWatermarkAdder';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const faqs = [
  { q: 'What kind of watermarks can I add?', a: 'You can add text watermarks with customizable font size, opacity, and rotation. The watermark is applied diagonally across every page.' },
  { q: 'Can I add an image watermark?', a: 'Currently only text watermarks are supported. Image watermark support is coming soon.' },
  { q: 'Can I control the watermark position?', a: 'The watermark is centered and rotated at 45° for maximum coverage. You can adjust opacity and font size to control its prominence.' },
  { q: 'Is the watermark removable?', a: 'The watermark is embedded directly into the PDF. It cannot be easily removed without specialized tools, making it effective for document protection.' },
];

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

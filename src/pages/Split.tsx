import { motion } from 'framer-motion';
import PDFSplitter from '@/components/PDFSplitter';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does PDF splitting work?', a: 'Upload a PDF file and choose to split all pages into individual files, or enter a page range (e.g., "1-3, 5") to extract specific pages into a new PDF.' },
  { q: 'Can I extract specific pages?', a: 'Yes! Switch to "Page Range" mode and enter the pages you want, like "1-3, 5, 8-10". They\'ll be combined into a single new PDF.' },
  { q: 'Is there a page limit?', a: 'No. You can split PDFs of any size — there are no artificial page or file size limits.' },
  { q: 'Are the split files the same quality?', a: 'Yes. Pages are copied without any re-encoding, so quality is preserved exactly as the original.' },
  { q: 'Is this free?', a: 'Completely free. No subscriptions, no watermarks, no hidden costs.' },
];

const Split = () => (
  <ToolPageLayout activeTab="split">
    <SEOHead
      title="Split PDF Pages Online — Free, Private | MergePDF"
      description="Split PDF into individual pages or extract a custom range. 100% free and private — processed locally in your browser."
      path="/split"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Split PDF into <span className="text-primary">pages</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Extract every page from your PDF as a separate file — entirely in your browser.
        </p>
      </div>
      <PDFSplitter />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default Split;

import { motion } from 'framer-motion';
import PDFPageNumberer from '@/components/PDFPageNumberer';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How do I add page numbers to a PDF?', a: 'Upload your PDF, choose top or bottom position, then click "Add Page Numbers". The tool adds sequential numbers to every page.' },
  { q: 'Is adding page numbers free?', a: 'Yes, completely free with no limits, no watermarks, and no account required.' },
  { q: 'Can I choose where page numbers appear?', a: 'Yes, you can place them at the top or bottom center of each page.' },
];

const PageNumbers = () => (
  <ToolPageLayout activeTab="page-numbers">
    <SEOHead
      title="Add Page Numbers to PDF Free Online | MergesPDF"
      description="Add page numbers to any PDF document for free. Choose top or bottom position. No sign-up, no uploads — processed in your browser."
      path="/page-numbers"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Add <span className="text-primary">Page Numbers</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Number every page of your PDF — choose top or bottom position.
        </p>
      </div>
      <PDFPageNumberer />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default PageNumbers;

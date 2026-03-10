import { motion } from 'framer-motion';
import BatchProcessor from '@/components/BatchProcessor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What batch operations are available?', a: 'You can batch merge (combine all PDFs into one) or batch compress (compress each PDF individually) with progress tracking.' },
  { q: 'How many files can I process at once?', a: 'There is no artificial limit. Process as many files as your browser can handle.' },
  { q: 'Is there a progress indicator?', a: 'Yes! A progress bar shows the status of each file being processed, so you always know how far along the batch is.' },
  { q: 'Are all files processed locally?', a: 'Yes. All batch processing happens in your browser. No files are uploaded to any server.' },
];

const Batch = () => (
  <ToolPageLayout activeTab="batch">
    <SEOHead
      title="Batch PDF Processing — Free | MergePDF"
      description="Process multiple PDF files at once — batch merge, compress, and convert. Free and private."
      path="/batch"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Batch <span className="text-primary">Processing</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Process multiple PDF files simultaneously with progress tracking.
        </p>
      </div>
      <BatchProcessor />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default Batch;

import { motion } from 'framer-motion';
import PDFCompressor from '@/components/PDFCompressor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does PDF compression work?', a: 'Our compressor strips unnecessary metadata, rebuilds the document structure, and removes unused objects to reduce file size without affecting visible content.' },
  { q: 'Will compression reduce quality?', a: 'The compression technique we use focuses on metadata removal and structure optimization. The visible content and page quality remain unchanged.' },
  { q: 'How much can I reduce the file size?', a: 'Results vary by document. PDFs with lots of metadata, unused fonts, or duplicated objects can see 10-60% size reduction. Already-optimized PDFs will see smaller gains.' },
  { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large files (100MB+) may be slower to process since everything runs in your browser.' },
  { q: 'Can I compress multiple PDFs at once?', a: 'Yes! Use the Batch Processing tool to compress multiple PDFs simultaneously with progress tracking.' },
];

const Compress = () => (
  <ToolPageLayout activeTab="compress">
    <SEOHead
      title="Compress PDF Online — Reduce File Size Free | MergePDF"
      description="Compress PDF files to reduce size by stripping metadata. Free, private, no upload — everything runs in your browser."
      path="/compress"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Compress PDF <span className="text-primary">files</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Reduce file size by stripping metadata — entirely in your browser.
        </p>
      </div>
      <PDFCompressor />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default Compress;

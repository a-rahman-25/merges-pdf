import { motion } from 'framer-motion';
import WordToPDF from '@/components/WordToPDF';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What Word formats are supported?', a: 'We support .doc and .docx files. For best results, use .docx format.' },
  { q: 'Is formatting preserved?', a: 'The converter extracts text content and renders it into a well-formatted PDF. Complex formatting (tables, images) may not be fully preserved in the browser-based conversion.' },
  { q: 'What about images in the Word file?', a: 'Currently, text content is extracted and converted. Embedded images in Word documents may not appear in the output PDF.' },
  { q: 'Is there a file size limit?', a: 'No hard limit, but very large documents may take longer to process since everything runs in your browser.' },
];

const WordToPdf = () => (
  <ToolPageLayout activeTab="word-to-pdf">
    <SEOHead
      title="Word to PDF Converter Online — Free | MergePDF"
      description="Convert Word documents (.docx) to PDF format. Free and private — processed in your browser."
      path="/word-to-pdf"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Word to <span className="text-primary">PDF</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Convert Word documents to PDF format instantly.
        </p>
      </div>
      <WordToPDF />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default WordToPdf;

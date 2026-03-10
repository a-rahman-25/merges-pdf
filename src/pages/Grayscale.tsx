import { motion } from 'framer-motion';
import PDFGrayscale from '@/components/PDFGrayscale';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What does converting to grayscale do?', a: 'It rebuilds your PDF without color data, resulting in a black-and-white document that is often smaller in file size.' },
  { q: 'Will this reduce my file size?', a: 'In many cases yes, especially for PDFs with color images or graphics. The reduction depends on the original content.' },
  { q: 'Is the conversion done locally?', a: 'Yes, 100%. Your file never leaves your browser — everything is processed on your device.' },
  { q: 'Will text quality be affected?', a: 'No. Text remains sharp and fully selectable. Only colors are converted to shades of gray.' },
];

const Grayscale = () => (
  <ToolPageLayout activeTab="grayscale">
    <SEOHead
      title="Convert PDF to Grayscale — Free Online | MergePDF"
      description="Convert color PDFs to grayscale to reduce file size. 100% free, private, and processed in your browser."
      path="/grayscale"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Convert to <span className="text-primary">Grayscale</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Remove colors from your PDF to reduce file size — processed entirely in your browser.
        </p>
      </div>
      <PDFGrayscale />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default Grayscale;

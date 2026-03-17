import { motion } from 'framer-motion';
import PDFRedactor from '@/components/PDFRedactor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does PDF redaction work?', a: 'Upload a PDF and draw black rectangles over sensitive areas on each page. The redacted PDF will have those areas permanently blacked out.' },
  { q: 'Is the redaction permanent?', a: 'Yes — black rectangles are drawn directly onto the PDF content. The original text underneath is covered but the original file is not modified.' },
  { q: 'Can I redact multiple pages?', a: 'Yes! Navigate between pages and draw redaction rectangles on any page. All redactions are applied when you download.' },
  { q: 'Is this truly private?', a: 'Absolutely. Everything happens in your browser. Your PDF never leaves your device.' },
];

const PdfRedactPage = () => (
  <ToolPageLayout activeTab="redact" as any>
    <SEOHead
      title="Redact PDF — Black Out Sensitive Information | MergePDF"
      description="Redact sensitive information from PDFs by drawing black rectangles. Free, private — processed locally in your browser."
      path="/pdf-redact"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Redact <span className="text-primary">PDF</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Black out sensitive information — draw rectangles on any page.
        </p>
      </div>
      <PDFRedactor />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default PdfRedactPage;

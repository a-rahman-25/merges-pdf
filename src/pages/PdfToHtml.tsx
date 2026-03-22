import { motion } from 'framer-motion';
import PDFToHTML from '@/components/PDFToHTML';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const PdfToHtml = () => {
  return (
    <ToolPageLayout activeTab="pdf-to-html">
      <SEOHead
        title="PDF to HTML Converter — Free Online | MergePDF"
        description="Convert PDF documents to clean, semantic HTML. Free and processed in your browser."
        path="/pdf-to-html"
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            PDF to <span className="text-primary">HTML</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Convert your PDF documents to clean, responsive HTML pages.
          </p>
        </div>
        <PDFToHTML />
        <ToolFAQ toolId="pdfToHtml" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfToHtml;

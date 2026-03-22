import { motion } from 'framer-motion';
import PDFToMarkdown from '@/components/PDFToMarkdown';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const PdfToMarkdown = () => {
  return (
    <ToolPageLayout activeTab="pdf-to-markdown">
      <SEOHead
        title="PDF to Markdown Converter — Free Online | MergePDF"
        description="Convert PDF documents to Markdown format. Free and processed in your browser."
        path="/pdf-to-markdown"
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            PDF to <span className="text-primary">Markdown</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Convert PDF content to clean, portable Markdown format.
          </p>
        </div>
        <PDFToMarkdown />
        <ToolFAQ toolId="pdfToMarkdown" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfToMarkdown;

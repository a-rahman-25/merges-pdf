import { motion } from 'framer-motion';
import PDFToJSON from '@/components/PDFToJSON';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const PdfToJson = () => {
  return (
    <ToolPageLayout activeTab="pdf-to-json">
      <SEOHead
        title="PDF to JSON Converter — Free Online | MergePDF"
        description="Extract PDF content as structured JSON data. Free and processed in your browser."
        path="/pdf-to-json"
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            PDF to <span className="text-primary">JSON</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Extract structured data from PDFs as downloadable JSON.
          </p>
        </div>
        <PDFToJSON />
        <ToolFAQ toolId="pdfToJson" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfToJson;

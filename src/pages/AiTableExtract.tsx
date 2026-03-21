import { motion } from 'framer-motion';
import AITableExtractor from '@/components/AITableExtractor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What types of tables can AI extract?', a: 'The AI can detect and extract any structured tabular data from PDFs including financial tables, data sheets, invoices, reports, and more.' },
  { q: 'What format is the output?', a: 'Tables are extracted as CSV format which you can copy or download, then open in Excel, Google Sheets, or any spreadsheet app.' },
  { q: 'Does it work with scanned PDFs?', a: 'It works best with text-based PDFs. For scanned documents, try the OCR tool first to extract text, then use this tool.' },
  { q: 'Is there a page limit?', a: 'The tool processes the first ~15,000 characters of text from your PDF, which typically covers 10-20 pages depending on content density.' },
];

const AiTableExtract = () => {
  return (
    <ToolPageLayout activeTab="ai-table-extract">
      <SEOHead
        title="AI Table Extraction — Extract Tables from PDF to CSV | MergePDF"
        description="Upload a PDF and AI will find and extract all tables as downloadable CSV data. Smart detection of tabular content."
        path="/ai-table-extract"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            AI <span className="text-primary">Table Extraction</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Extract tables from PDFs as clean, downloadable CSV data
          </p>
        </div>
        <AITableExtractor />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default AiTableExtract;

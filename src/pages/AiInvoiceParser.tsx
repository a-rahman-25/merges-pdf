import { motion } from 'framer-motion';
import AIInvoiceParser from '@/components/AIInvoiceParser';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What information does it extract?', a: 'Vendor details, invoice numbers, dates, line items with quantities and prices, tax amounts, totals, payment information, and more.' },
  { q: 'Does it work with receipts too?', a: 'Yes! The parser handles both invoices and receipts, extracting all available financial data from either format.' },
  { q: 'Can it handle different invoice layouts?', a: 'The AI adapts to various invoice formats and layouts. It works with most standard invoice and receipt PDFs.' },
  { q: 'Is my financial data safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiInvoiceParser = () => (
  <ToolPageLayout activeTab="ai-invoice-parser">
    <SEOHead
      title="AI Invoice Parser — Extract Line Items & Totals | MergesPDF"
      description="Upload a PDF invoice or receipt and automatically extract line items, totals, dates, vendor info, and payment details using AI."
      path="/ai-invoice-parser"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Invoice Parser</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Extract line items, totals, dates, and vendor info from invoices
        </p>
      </div>
      <AIInvoiceParser />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiInvoiceParser;

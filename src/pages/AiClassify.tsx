import { motion } from 'framer-motion';
import AIClassifier from '@/components/AIClassifier';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What categories does the AI classify into?', a: 'The AI can classify documents into categories like Invoice, Contract, Report, Resume, Letter, Legal Document, Academic Paper, Manual, Financial Statement, and more.' },
  { q: 'Can I classify multiple documents at once?', a: 'Yes! Upload multiple PDFs and the AI will classify each one individually, providing category, confidence level, and key indicators.' },
  { q: 'How accurate is the classification?', a: 'The AI provides a confidence level (High/Medium/Low) for each classification. It works best with clearly structured documents.' },
  { q: 'Is my data safe?', a: 'Yes, your documents are processed securely and never stored. Text is extracted locally in your browser.' },
];

const AiClassify = () => {
  return (
    <ToolPageLayout activeTab="ai-classify">
      <SEOHead
        title="AI Document Classification — Auto-Categorize PDFs | MergePDF"
        description="Upload PDFs and AI automatically classifies them by type — invoices, contracts, reports, resumes, and more."
        path="/ai-classify"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            AI <span className="text-primary">Document Classification</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Auto-categorize your PDFs by type — invoices, contracts, reports, and more
          </p>
        </div>
        <AIClassifier />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default AiClassify;

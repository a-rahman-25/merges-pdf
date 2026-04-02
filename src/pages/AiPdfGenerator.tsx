import { motion } from 'framer-motion';
import AIPDFGenerator from '@/components/AIPDFGenerator';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What types of documents can I generate?', a: 'Contracts, NDAs, letters, reports, proposals, invoices, memos, policies, resumes, and more — just describe what you need.' },
  { q: 'Can I download the generated document as PDF?', a: 'Yes! After generation, click "Download as PDF" to get a professionally formatted PDF document.' },
  { q: 'How detailed should my description be?', a: 'The more specific you are, the better the result. Include names, dates, terms, and key details for best results.' },
  { q: 'Is the generated content unique?', a: 'Yes, each document is generated fresh by AI based on your specific description and requirements.' },
];

const AiPdfGenerator = () => (
  <ToolPageLayout activeTab="ai-pdf-generator">
    <SEOHead
      title="AI PDF Generator — Create Documents from Text Prompts | MergesPDF"
      description="Describe the document you need and AI will generate professional content. Download as PDF instantly."
      path="/ai-pdf-generator"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">PDF Generator</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Describe what you need and AI will create a professional document
        </p>
      </div>
      <AIPDFGenerator />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiPdfGenerator;

import { motion } from 'framer-motion';
import AIContractAnalyzer from '@/components/AIContractAnalyzer';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What types of contracts can this analyze?', a: 'The AI can analyze any legal document including NDAs, employment contracts, service agreements, leases, terms of service, and more.' },
  { q: 'Does it identify risks?', a: 'Yes! The AI highlights key risks and red flags, rating each as High, Medium, or Low severity, with specific recommendations.' },
  { q: 'How accurate is the analysis?', a: 'The AI provides thorough analysis but should not replace professional legal advice. Use it as a starting point for understanding contracts.' },
  { q: 'Is my contract data safe?', a: 'Yes, text is extracted locally in your browser. The extracted text is processed securely and never stored.' },
];

const AiContractAnalyzer = () => (
  <ToolPageLayout activeTab="ai-contract-analyzer">
    <SEOHead
      title="AI Contract Analyzer — Detect Risks & Key Clauses | MergesPDF"
      description="Upload a contract or legal document and AI will identify key clauses, risks, obligations, and financial terms."
      path="/ai-contract-analyzer"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Contract Analyzer</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Identify key clauses, risks, and obligations in contracts & legal documents
        </p>
      </div>
      <AIContractAnalyzer />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiContractAnalyzer;

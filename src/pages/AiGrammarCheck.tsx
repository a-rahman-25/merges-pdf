import { motion } from 'framer-motion';
import AIGrammarChecker from '@/components/AIGrammarChecker';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What does the grammar checker review?', a: 'It checks grammar, spelling, style, readability, sentence structure, tone consistency, and provides actionable improvement suggestions.' },
  { q: 'Can it check any type of document?', a: 'Yes! It works with any PDF document — essays, reports, articles, contracts, emails, and more.' },
  { q: 'Does it provide a readability score?', a: 'Yes, the AI provides an overall quality score and readability level assessment along with detailed feedback.' },
  { q: 'Is my document data safe?', a: 'Yes, text is extracted locally in your browser and processed securely. Nothing is stored.' },
];

const AiGrammarCheck = () => (
  <ToolPageLayout activeTab="ai-grammar-check">
    <SEOHead
      title="AI Grammar & Style Checker — Review PDFs for Errors | MergesPDF"
      description="Upload a PDF and AI will review it for grammar errors, style improvements, and readability — with specific suggestions."
      path="/ai-grammar-check"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Grammar & Style Checker</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Check grammar, readability, and style with AI-powered document review
        </p>
      </div>
      <AIGrammarChecker />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiGrammarCheck;

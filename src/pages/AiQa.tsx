import { motion } from 'framer-motion';
import AIQandA from '@/components/AIQandA';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does AI Q&A work?', a: 'Upload a PDF and ask any question about it. AI analyzes the document context and provides relevant answers in a chat interface.' },
  { q: 'Can I ask follow-up questions?', a: 'Yes! The chat maintains conversation history, so you can ask follow-up questions and the AI will understand the context.' },
  { q: 'How accurate are the answers?', a: 'AI answers are based on document analysis and general knowledge. For critical decisions, always verify answers against the original document.' },
  { q: 'Is there a limit on questions?', a: 'You can ask as many questions as you like. There are generous free usage limits for the AI service.' },
];

const AiQa = () => (
  <ToolPageLayout activeTab="ai-qa">
    <SEOHead
      title="AI PDF Q&A — Ask Questions About PDFs | MergePDF"
      description="Upload a PDF and ask questions about it. AI will analyze and answer instantly."
      path="/ai-qa"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI PDF <span className="text-primary">Q&A</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Upload a PDF and ask questions — AI will answer based on your document.
        </p>
      </div>
      <AIQandA />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiQa;

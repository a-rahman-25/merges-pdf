import { motion } from 'framer-motion';
import AIRewriter from '@/components/AIRewriter';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What tones are available?', a: 'Choose from Professional, Casual, Academic, Simplified, Creative, or Concise. Each dramatically changes the style while preserving meaning.' },
  { q: 'Does it preserve the original meaning?', a: 'Yes! The AI rewrites the text while keeping all key information, facts, and arguments intact. Only the tone and style change.' },
  { q: 'Can I rewrite the same document in multiple tones?', a: 'Absolutely! After one rewrite, just select a different tone and click "Rewrite Again" to get a new version.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiRewriter = () => (
  <ToolPageLayout activeTab="ai-rewriter">
    <SEOHead
      title="AI PDF Rewriter — Paraphrase in Any Tone | MergesPDF"
      description="Upload a PDF and rewrite it in any tone — professional, casual, academic, simplified, creative, or concise. AI-powered paraphrasing."
      path="/ai-rewriter"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">PDF Rewriter</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Paraphrase and rewrite your documents in any tone or style
        </p>
      </div>
      <AIRewriter />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiRewriter;

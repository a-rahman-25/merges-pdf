import { motion } from 'framer-motion';
import AIHighlighter from '@/components/AIHighlighter';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What does the AI Highlighter identify?', a: 'It identifies key sentences, named entities (people, organizations, locations, dates), important sections, and top keywords from your document.' },
  { q: 'Does it modify my PDF?', a: 'No, the tool analyzes your document and presents highlights in a readable format. Your original PDF remains unchanged.' },
  { q: 'What types of documents work best?', a: 'Reports, articles, contracts, research papers, and any text-heavy PDF. The more content, the better the analysis.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiHighlighter = () => (
  <ToolPageLayout activeTab="ai-highlighter">
    <SEOHead
      title="AI PDF Highlighter — Auto-Highlight Key Content | MergesPDF"
      description="Upload a PDF and automatically highlight key sentences, named entities, and important sections using AI-powered analysis."
      path="/ai-highlighter"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">PDF Highlighter</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Auto-highlight key sentences, entities, and important sections
        </p>
      </div>
      <AIHighlighter />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiHighlighter;

import { motion } from 'framer-motion';
import AIPDFChat from '@/components/AIPDFChat';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does AI PDF Chat work?', a: 'Upload a PDF and start a conversation. The AI reads your document and answers questions based on its content, maintaining full conversation context.' },
  { q: 'Can I ask follow-up questions?', a: 'Yes! The chat maintains conversation history, so you can ask follow-ups and the AI will understand the full context of your discussion.' },
  { q: 'What types of documents work best?', a: 'Any PDF with readable text works great — reports, articles, contracts, manuals, research papers, and more.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiPdfChat = () => (
  <ToolPageLayout activeTab="ai-pdf-chat">
    <SEOHead
      title="AI PDF Chat — Talk to Your Documents | MergesPDF"
      description="Upload a PDF and have a conversation with AI about your document. Ask questions, get insights, and explore your files interactively."
      path="/ai-pdf-chat"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">PDF Chat</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Have a conversation with your PDF — ask questions and get AI-powered answers
        </p>
      </div>
      <AIPDFChat />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiPdfChat;

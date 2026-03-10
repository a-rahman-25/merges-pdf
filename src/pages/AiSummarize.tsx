import { motion } from 'framer-motion';
import AISummarizer from '@/components/AISummarizer';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does AI summarization work?', a: 'Upload a PDF and our AI model analyzes the document structure and content to generate a comprehensive summary of key points and topics.' },
  { q: 'Is the summary accurate?', a: 'AI summaries provide a helpful overview but should be verified against the original document for critical use cases.' },
  { q: 'Is my document sent to a server?', a: 'Document metadata is sent to our AI service for analysis. The actual file content stays in your browser. Our AI service does not store any data.' },
  { q: 'Can I summarize large documents?', a: 'Yes, documents of any size can be summarized. Larger documents may take slightly longer to process.' },
];

const AiSummarize = () => (
  <ToolPageLayout activeTab="ai-summarize">
    <SEOHead
      title="AI PDF Summarizer — Free | MergePDF"
      description="Upload a PDF and get an AI-generated summary instantly. Free and powered by advanced AI."
      path="/ai-summarize"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI PDF <span className="text-primary">Summarizer</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Upload a PDF and let AI analyze and summarize it for you.
        </p>
      </div>
      <AISummarizer />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiSummarize;

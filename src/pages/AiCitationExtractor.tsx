import { motion } from 'framer-motion';
import AICitationExtractor from '@/components/AICitationExtractor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What citation styles does it support?', a: 'The AI can detect and extract citations in APA, MLA, IEEE, Chicago, Harvard, Vancouver, and most other common styles.' },
  { q: 'Does it extract DOIs?', a: 'Yes! The tool specifically identifies and lists all DOIs and URLs found in the references section.' },
  { q: 'Can it handle large bibliographies?', a: 'Yes, the tool processes up to 15,000 characters of text, which typically covers extensive reference sections.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiCitationExtractor = () => (
  <ToolPageLayout activeTab="ai-citation-extractor">
    <SEOHead
      title="AI Citation Extractor — Pull References & DOIs | MergesPDF"
      description="Upload an academic PDF and automatically extract all citations, references, bibliography entries, and DOIs using AI."
      path="/ai-citation-extractor"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Citation Extractor</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Extract references, bibliography entries, and DOIs from academic papers
        </p>
      </div>
      <AICitationExtractor />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiCitationExtractor;

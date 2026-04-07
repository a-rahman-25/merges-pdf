import { motion } from 'framer-motion';
import AIPDFTranslator from '@/components/AIPDFTranslator';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How is this different from the AI Translate tool?', a: 'This tool translates the entire document preserving its structure and formatting, while the basic translate tool works on extracted text snippets.' },
  { q: 'Which languages are supported?', a: 'Over 20 languages including Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, and many more.' },
  { q: 'Does it preserve document formatting?', a: 'The AI preserves headings, lists, tables, and paragraph structure in the translated output using markdown formatting.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiPdfTranslator = () => (
  <ToolPageLayout activeTab="ai-pdf-translator">
    <SEOHead
      title="AI PDF Translator — Translate Full Documents | MergesPDF"
      description="Translate entire PDF documents into 20+ languages while preserving layout and formatting using AI."
      path="/ai-pdf-translator"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">PDF Translator</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Translate entire documents preserving layout and structure
        </p>
      </div>
      <AIPDFTranslator />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiPdfTranslator;

import { motion } from 'framer-motion';
import AIPDFAutoFill from '@/components/AIPDFAutoFill';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What PDFs work with auto-fill?', a: 'Any PDF with fillable form fields (interactive forms). Scanned forms or flat PDFs without form fields are not supported.' },
  { q: 'How does the AI know what to fill?', a: 'The AI analyzes field names and your provided context to suggest appropriate values. More context = better suggestions.' },
  { q: 'Can I edit the suggestions before downloading?', a: 'Yes! All AI suggestions are editable. Review and modify any value before downloading the filled PDF.' },
  { q: 'Is my data safe?', a: 'Yes, form fields are read locally in your browser. Context is processed securely and never stored.' },
];

const AiPdfAutoFill = () => (
  <ToolPageLayout activeTab="ai-pdf-autofill">
    <SEOHead
      title="AI PDF Auto-Fill — Intelligently Fill PDF Forms | MergesPDF"
      description="Upload a PDF form and AI will suggest values for each field based on your context. Review, edit, and download the filled PDF."
      path="/ai-pdf-autofill"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">PDF Auto-Fill</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Intelligently fill PDF forms with AI-powered suggestions
        </p>
      </div>
      <AIPDFAutoFill />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiPdfAutoFill;

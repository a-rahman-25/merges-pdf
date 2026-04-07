import { motion } from 'framer-motion';
import AIFormCreator from '@/components/AIFormCreator';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What types of forms can I create?', a: 'Registration forms, surveys, applications, feedback forms, order forms, medical forms, checklists, and any custom form type.' },
  { q: 'Does it generate a fillable PDF?', a: 'It generates a detailed form structure with field specifications and JSON schema that you can use to build the actual form.' },
  { q: 'Can I customize the output?', a: 'Yes! Describe exactly what fields and sections you need, and the AI will tailor the form to your requirements.' },
  { q: 'Is my data safe?', a: 'Yes, all processing happens through secure AI. No data is stored after the session.' },
];

const AiFormCreator = () => (
  <ToolPageLayout activeTab="ai-form-creator">
    <SEOHead
      title="AI PDF Form Creator — Design Forms with AI | MergesPDF"
      description="Design and create PDF form structures with text fields, checkboxes, and dropdowns using AI-powered form generation."
      path="/ai-form-creator"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Form Creator</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Design professional forms with AI — describe what you need
        </p>
      </div>
      <AIFormCreator />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiFormCreator;

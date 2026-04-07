import { motion } from 'framer-motion';
import AIAccessibilityChecker from '@/components/AIAccessibilityChecker';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What accessibility standards does it check?', a: 'It evaluates against WCAG 2.1 guidelines including heading structure, reading order, text alternatives, color contrast, and proper table/list markup.' },
  { q: 'Does it fix accessibility issues?', a: 'It identifies issues and provides specific recommendations. You can use the findings to fix your document.' },
  { q: 'Is this a substitute for a full accessibility audit?', a: 'It provides a comprehensive AI-based analysis, but for legal compliance you should also use dedicated accessibility testing tools.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiAccessibilityChecker = () => (
  <ToolPageLayout activeTab="ai-accessibility-check">
    <SEOHead
      title="AI PDF Accessibility Checker — WCAG Compliance Audit | MergesPDF"
      description="Check your PDF for WCAG compliance, alt text, heading structure, reading order, and color contrast issues using AI."
      path="/ai-accessibility-check"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Accessibility Checker</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Audit WCAG compliance, heading structure, and accessibility issues
        </p>
      </div>
      <AIAccessibilityChecker />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiAccessibilityChecker;

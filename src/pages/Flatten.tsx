import { motion } from 'framer-motion';
import PDFFlattener from '@/components/PDFFlattener';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What does flattening a PDF do?', a: 'Flattening removes form fields, annotations, layers, and interactive elements, producing a static, non-editable PDF.' },
  { q: 'Is PDF flattening free?', a: 'Yes, completely free with no limits or sign-up required.' },
  { q: 'Will flattening reduce file size?', a: 'It can. By removing interactive elements and rebuilding the structure, the file often becomes smaller.' },
];

const Flatten = () => (
  <ToolPageLayout activeTab="flatten">
    <SEOHead
      title="Flatten PDF Free Online — Remove Form Fields | MergesPDF"
      description="Flatten PDF files for free. Remove form fields, annotations, and layers to create a static PDF. No sign-up, browser-based processing."
      path="/flatten"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Flatten <span className="text-primary">PDF</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Remove form fields, annotations, and layers — make your PDF static.
        </p>
      </div>
      <PDFFlattener />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default Flatten;

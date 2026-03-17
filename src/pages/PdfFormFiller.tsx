import { motion } from 'framer-motion';
import PDFFormFiller from '@/components/PDFFormFiller';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const faqs = [
  { q: 'How does the PDF form filler work?', a: 'Upload a PDF with form fields, and the tool automatically detects all fillable fields. Enter your values and download the completed PDF.' },
  { q: 'What types of form fields are supported?', a: 'Text fields are fully supported. The tool detects all PDF form field types including text inputs, checkboxes, and dropdowns.' },
  { q: 'Will the form data be embedded in the PDF?', a: 'Yes — the form is flattened after filling, so the data becomes part of the PDF content and cannot be easily edited.' },
  { q: 'What if my PDF has no form fields?', a: 'The tool will let you know if no fillable fields are detected. Only PDFs with interactive form fields (like fillable tax forms) will work.' },
];

const PdfFormFillerPage = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab={'form-filler' as any}>
      <SEOHead
        title="Fill PDF Forms Online — Free PDF Form Filler | MergePDF"
        description="Fill in PDF form fields directly in your browser. Free, private — no uploads, no sign-up required."
        path="/pdf-form-filler"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.formFiller.h1a', lang)} <span className="text-primary">{tt('page.formFiller.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.formFiller.sub', lang)}
          </p>
        </div>
        <PDFFormFiller />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfFormFillerPage;

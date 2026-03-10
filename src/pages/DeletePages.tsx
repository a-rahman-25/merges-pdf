import { motion } from 'framer-motion';
import PDFPageDeleter from '@/components/PDFPageDeleter';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How do I delete pages from a PDF?', a: 'Upload a PDF, enter the page numbers you want to remove (e.g., "1-3, 5"), and click Delete Pages. A new PDF without those pages will be downloaded.' },
  { q: 'Can I undo deleted pages?', a: 'The original file is never modified. If you need the deleted pages back, simply use the original file again.' },
  { q: 'Can I delete all pages except one?', a: 'Yes, but you must keep at least one page. Enter all pages except the one you want to keep.' },
  { q: 'Is the page order preserved?', a: 'Yes. The remaining pages keep their original order after deletion.' },
];

const DeletePages = () => (
  <ToolPageLayout activeTab="delete-pages">
    <SEOHead
      title="Delete PDF Pages Online — Free, Private | MergePDF"
      description="Remove specific pages from your PDF file. 100% free and private — processed locally in your browser."
      path="/delete-pages"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Delete PDF <span className="text-primary">Pages</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Remove unwanted pages from your PDF — entirely in your browser.
        </p>
      </div>
      <PDFPageDeleter />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default DeletePages;

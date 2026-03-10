import { motion } from 'framer-motion';
import PDFRotator from '@/components/PDFRotator';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How do I rotate PDF pages?', a: 'Upload a PDF, select the rotation angle (90°, 180°, or 270°), and click Rotate. The rotated PDF will download instantly.' },
  { q: 'Can I rotate specific pages only?', a: 'Currently, rotation applies to all pages in the PDF. For selective page rotation, split the PDF first, rotate individual pages, then merge them back.' },
  { q: 'Does rotation change the content?', a: 'No, rotation only changes the page orientation. All text, images, and formatting remain exactly the same.' },
  { q: 'Can I undo a rotation?', a: 'Yes — simply rotate the PDF again. For example, if you rotated 90° clockwise, rotate 270° to return to the original orientation.' },
];

const Rotate = () => (
  <ToolPageLayout activeTab="rotate">
    <SEOHead
      title="Rotate PDF Pages Online — Free, No Upload | MergePDF"
      description="Rotate all PDF pages by 90°, 180°, or 270° with one click. Free, private — processed locally in your browser."
      path="/rotate"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Rotate PDF <span className="text-primary">pages</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Rotate all pages by 90°, 180°, or 270° — entirely in your browser.
        </p>
      </div>
      <PDFRotator />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default Rotate;

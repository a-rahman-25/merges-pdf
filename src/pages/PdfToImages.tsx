import { motion } from 'framer-motion';
import PDFToImages from '@/components/PDFToImages';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How do I convert PDF to images?', a: 'Upload a PDF, select the image format (PNG or JPG) and quality, then click Convert. Each page becomes a separate image.' },
  { q: 'What quality settings are available?', a: '1x for standard resolution, 2x for high quality (recommended), and 3x for maximum detail. Higher quality means larger file sizes.' },
  { q: 'Can I download all images at once?', a: 'Yes! Click "Download All" to get a ZIP file containing all page images. You can also download individual pages by clicking on them.' },
  { q: 'Are my files uploaded to a server?', a: 'No — everything is processed locally in your browser. Your files never leave your device.' },
];

const PdfToImagesPage = () => (
  <ToolPageLayout activeTab="pdf-to-images" as any>
    <SEOHead
      title="PDF to Images — Convert PDF Pages to PNG/JPG | MergePDF"
      description="Convert each PDF page into high-quality PNG or JPG images. Free, private — processed locally in your browser."
      path="/pdf-to-images"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          PDF to <span className="text-primary">Images</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Convert each page to high-quality PNG or JPG — entirely in your browser.
        </p>
      </div>
      <PDFToImages />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default PdfToImagesPage;

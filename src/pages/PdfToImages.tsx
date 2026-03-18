import { motion } from 'framer-motion';
import PDFToImages from '@/components/PDFToImages';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';
import { getTranslatedFaqs } from '@/lib/faq-translations';

const PdfToImagesPage = () => {
  const { lang } = useI18n();
  const faqs = getTranslatedFaqs('pdfToImages', lang);
  return (
    <ToolPageLayout activeTab={'pdf-to-images' as any}>
      <SEOHead title="PDF to Images — Convert PDF Pages to PNG/JPG | MergePDF" description="Convert each PDF page into high-quality PNG or JPG images. Free, private — processed locally in your browser." path="/pdf-to-images" faqs={faqs} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.pdfToImages.h1a', lang)} <span className="text-primary">{tt('page.pdfToImages.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">{tt('page.pdfToImages.sub', lang)}</p>
        </div>
        <PDFToImages />
        <ToolFAQ toolId="pdfToImages" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfToImagesPage;

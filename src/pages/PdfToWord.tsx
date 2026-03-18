import { motion } from 'framer-motion';
import PDFToWord from '@/components/PDFToWord';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const PdfToWord = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="pdf-to-word">
      <SEOHead
        title="PDF to Word Converter Online — Free | MergePDF"
        description="Convert PDF documents to Microsoft Word (.docx) format. Free and private — processed in your browser."
        path="/pdf-to-word"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.pdfToWord.h1a', lang)} <span className="text-primary">{tt('page.pdfToWord.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.pdfToWord.sub', lang)}
          </p>
        </div>
        <PDFToWord />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default PdfToWord;

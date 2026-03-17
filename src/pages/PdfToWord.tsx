import { motion } from 'framer-motion';
import PDFToWord from '@/components/PDFToWord';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const faqs = [
  { q: 'How does PDF to Word conversion work?', a: 'We extract the document structure from your PDF and create a Word (.docx) file. The conversion preserves page structure and basic formatting.' },
  { q: 'Will all text be preserved?', a: 'Browser-based conversion has limitations. For complex PDFs with embedded fonts or advanced layouts, a desktop tool may produce better results.' },
  { q: 'What format is the output?', a: 'The output is a Microsoft Word .docx file that can be opened in Word, Google Docs, LibreOffice, and most word processors.' },
  { q: 'Is my PDF uploaded anywhere?', a: 'No. Everything is processed in your browser. Your file never leaves your device.' },
];

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

import { motion } from 'framer-motion';
import WordToPDF from '@/components/WordToPDF';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const WordToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="word-to-pdf">
      <SEOHead
        title="Word to PDF Converter Online — Free | MergePDF"
        description="Convert Word documents (.docx) to PDF format. Free and private — processed in your browser."
        path="/word-to-pdf"
        
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.wordToPdf.h1a', lang)} <span className="text-primary">{tt('page.wordToPdf.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.wordToPdf.sub', lang)}
          </p>
        </div>
        <WordToPDF />
        <ToolFAQ toolId="wordToPdf" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default WordToPdf;

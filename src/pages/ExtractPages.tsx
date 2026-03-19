import { motion } from 'framer-motion';
import PDFPageExtractor from '@/components/PDFPageExtractor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const ExtractPages = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="extract-pages">
      <SEOHead
        title="Extract PDF Pages Online — Free, Private | MergePDF"
        description="Extract selected pages from your PDF into a new document. 100% free — processed locally in your browser."
        path="/extract-pages"
        
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.extractPages.h1a', lang)} <span className="text-primary">{tt('page.extractPages.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.extractPages.sub', lang)}
          </p>
        </div>
        <PDFPageExtractor />
        <ToolFAQ toolId="extractPages" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default ExtractPages;

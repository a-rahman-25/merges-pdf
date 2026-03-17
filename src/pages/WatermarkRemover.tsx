import { motion } from 'framer-motion';
import WatermarkRemover from '@/components/WatermarkRemover';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const WatermarkRemoverPage = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="watermark-remover">
      <SEOHead
        title="Remove Watermark from PDF Online — Free Tool | MergePDF"
        description="Remove watermarks from PDF files instantly. 100% free, private — everything runs in your browser with no uploads."
        path="/watermark-remover"
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.watermarkRemover.h1a', lang)} <span className="text-primary">{tt('page.watermarkRemover.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.watermarkRemover.sub', lang)}
          </p>
        </div>
        <WatermarkRemover />
      </motion.div>
    </ToolPageLayout>
  );
};

export default WatermarkRemoverPage;

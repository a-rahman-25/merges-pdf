import { motion } from 'framer-motion';
import PDFUnlocker from '@/components/PDFUnlocker';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const UnlockPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="unlock">
      <SEOHead
        title="Unlock PDF Free Online — Remove PDF Restrictions | MergesPDF"
        description="Remove PDF restrictions (print, copy, edit) for free. Unlock PDF files online without sign-up. Browser-based, private processing."
        path="/unlock-pdf"
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.unlock.h1a', lang)} <span className="text-primary">{tt('page.unlock.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.unlock.sub', lang)}
          </p>
        </div>
        <PDFUnlocker />
        <ToolFAQ toolId="unlock" />
      </motion.div>
    </ToolPageLayout>
  );
};

export default UnlockPdf;

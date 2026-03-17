import { motion } from 'framer-motion';
import PDFUnlocker from '@/components/PDFUnlocker';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const faqs = [
  { q: 'What restrictions can this tool remove?', a: 'It removes print, copy, and edit restrictions (owner password). It cannot bypass open-password protection.' },
  { q: 'Is unlocking PDFs free?', a: 'Yes, completely free. No sign-up or limits.' },
  { q: 'Is this legal?', a: 'Removing restrictions from PDFs you own or have permission to modify is legal. Do not use this tool on documents you don\'t have the right to unlock.' },
];

const UnlockPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="unlock">
      <SEOHead
        title="Unlock PDF Free Online — Remove PDF Restrictions | MergesPDF"
        description="Remove PDF restrictions (print, copy, edit) for free. Unlock PDF files online without sign-up. Browser-based, private processing."
        path="/unlock-pdf"
        faqs={faqs}
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
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default UnlockPdf;

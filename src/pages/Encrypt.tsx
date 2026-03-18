import { motion } from 'framer-motion';
import PDFEncryptor from '@/components/PDFEncryptor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const EncryptPage = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="encrypt">
      <SEOHead
        title="Encrypt PDF with Password — Free Online Tool | MergePDF"
        description="Add password protection to your PDF files for free. 100% private — everything runs in your browser with no uploads."
        path="/encrypt"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.encrypt.h1a', lang)} <span className="text-primary">{tt('page.encrypt.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.encrypt.sub', lang)}
          </p>
        </div>
        <PDFEncryptor />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default EncryptPage;

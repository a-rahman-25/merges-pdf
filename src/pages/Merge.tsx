import { motion } from 'framer-motion';
import PDFMerger from '@/components/PDFMerger';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const faqs = [
  { q: 'How do I merge PDF files?', a: 'Simply drag and drop your PDF files into the upload area, reorder them as needed, and click "Merge & Download". The combined PDF will be downloaded instantly.' },
  { q: 'Is there a limit on the number of files?', a: 'No, you can merge as many PDF files as your browser can handle. There is no artificial limit on file count or size.' },
  { q: 'Are my files uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your files never leave your device — we have zero access to your documents.' },
  { q: 'Can I reorder pages before merging?', a: 'Yes! After uploading your files, you can drag and drop them into any order before merging.' },
  { q: 'Does merging reduce quality?', a: 'No. The merge process preserves the original quality of every page in your PDFs. No compression or modification is applied.' },
  { q: 'Do I need to sign up?', a: 'No. MergePDF is completely free with no sign-up, no login, and no email required. Just upload and merge.' },
];

const Merge = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge">
      <SEOHead
        title="Merge PDF Files Online — Free, Private, No Upload | MergePDF"
        description="Combine multiple PDF files into one document for free. Drag to reorder pages. 100% private — files never leave your browser."
        path="/merge"
        faqs={faqs}
      />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {tt('page.merge.h1a', lang)} <span className="text-primary">{tt('page.merge.h1b', lang)}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            {tt('page.merge.sub', lang)}
          </p>
        </div>
        <PDFMerger />
        <ToolFAQ faqs={faqs} />
      </motion.div>
    </ToolPageLayout>
  );
};

export default Merge;

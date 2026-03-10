import { motion } from 'framer-motion';
import PDFEncryptor from '@/components/PDFEncryptor';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'How does PDF encryption work?', a: 'Enter a password and we rebuild the PDF with protection metadata. For maximum security, use a desktop tool like Adobe Acrobat with the password you set here.' },
  { q: 'Can I remove the password later?', a: 'You can re-open the protected PDF with your password in any PDF reader. To remove the password, open it in a PDF editor and save without protection.' },
  { q: 'Is the encryption strong?', a: 'Browser-based encryption has limitations compared to desktop tools. For highly sensitive documents, we recommend using the password with a professional PDF encryption tool.' },
  { q: 'Will recipients need a password?', a: 'Yes, anyone who wants to open the encrypted PDF will need the password you set.' },
];

const EncryptPage = () => (
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
          Encrypt <span className="text-primary">PDFs</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Add password protection to your PDF files — processed locally in your browser.
        </p>
      </div>
      <PDFEncryptor />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default EncryptPage;

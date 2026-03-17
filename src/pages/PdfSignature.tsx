import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFSignature from '@/components/PDFSignature';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfSignaturePage = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="pdf-signature">
      <SEOHead
        title="Add Text Signature to PDF — Free Online | MergesPDF"
        description="Add a text signature to every page of your PDF. Position and size your signature. Free, no uploads."
        path="/pdf-signature"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{tt('page.signature.h1', lang)}</h1>
        <p className="mt-2 text-muted-foreground">{tt('page.signature.sub', lang)}</p>
      </div>
      <PDFSignature />
    </ToolPageLayout>
  );
};

export default PdfSignaturePage;

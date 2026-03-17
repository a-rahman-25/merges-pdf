import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFMetadataEditor from '@/components/PDFMetadataEditor';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfMetadata = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="pdf-metadata">
      <SEOHead
        title="Edit PDF Metadata — Title, Author, Keywords | MergesPDF"
        description="View and edit PDF metadata: title, author, subject, keywords, creator. Free, no uploads."
        path="/pdf-metadata"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{tt('page.metadata.h1', lang)}</h1>
        <p className="mt-2 text-muted-foreground">{tt('page.metadata.sub', lang)}</p>
      </div>
      <PDFMetadataEditor />
    </ToolPageLayout>
  );
};

export default PdfMetadata;

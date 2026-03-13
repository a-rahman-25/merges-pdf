import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFMetadataEditor from '@/components/PDFMetadataEditor';

const PdfMetadata = () => (
  <ToolPageLayout activeTab="pdf-metadata">
    <SEOHead
      title="Edit PDF Metadata — Title, Author, Keywords | MergesPDF"
      description="View and edit PDF metadata: title, author, subject, keywords, creator. Free, no uploads."
      path="/pdf-metadata"
    />
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Edit PDF Metadata</h1>
      <p className="mt-2 text-muted-foreground">View and modify title, author, subject, keywords and more.</p>
    </div>
    <PDFMetadataEditor />
  </ToolPageLayout>
);

export default PdfMetadata;

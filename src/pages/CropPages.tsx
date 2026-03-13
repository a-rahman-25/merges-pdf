import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFPageCrop from '@/components/PDFPageCrop';

const CropPages = () => (
  <ToolPageLayout activeTab="crop-pages">
    <SEOHead
      title="Crop PDF Pages — Trim Margins Free | MergesPDF"
      description="Crop PDF pages by adjusting margins. Trim whitespace and resize pages. Free, no uploads."
      path="/crop-pages"
    />
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Crop PDF Pages</h1>
      <p className="mt-2 text-muted-foreground">Trim margins on all pages of your PDF document.</p>
    </div>
    <PDFPageCrop />
  </ToolPageLayout>
);

export default CropPages;

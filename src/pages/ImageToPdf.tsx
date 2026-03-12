import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ImageToPDF from '@/components/ImageToPDF';

const ImageToPdf = () => (
  <ToolPageLayout activeTab="image-to-pdf">
    <SEOHead
      title="Image to PDF — Convert JPG, PNG to PDF Free | MergesPDF"
      description="Convert JPG, PNG, and WEBP images to PDF. Drag to reorder, combine multiple images into one PDF. Free, no uploads."
      path="/image-to-pdf"
    />
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Image to PDF</h1>
      <p className="mt-2 text-muted-foreground">Convert and combine JPG, PNG, or WEBP images into a single PDF. Drag to reorder.</p>
    </div>
    <ImageToPDF />
  </ToolPageLayout>
);

export default ImageToPdf;

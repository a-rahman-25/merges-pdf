import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ImageToPDF from '@/components/ImageToPDF';

const MergeImages = () => (
  <ToolPageLayout activeTab="merge-images">
    <SEOHead
      title="Merge Images to PDF — Combine Multiple Images into One PDF | MergesPDF"
      description="Merge multiple JPG, PNG, and WEBP images into a single PDF document. Drag to reorder, rename before download. Free, no uploads."
      path="/merge-images"
    />
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Merge Images to PDF</h1>
      <p className="mt-2 text-muted-foreground">Combine multiple images (JPG, PNG, WEBP) into a single PDF. Drag to reorder pages.</p>
    </div>
    <ImageToPDF />
  </ToolPageLayout>
);

export default MergeImages;

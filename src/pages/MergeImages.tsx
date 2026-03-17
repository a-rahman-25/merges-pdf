import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ImageToPDF from '@/components/ImageToPDF';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What image formats can I merge into a PDF?', a: 'You can combine JPG, JPEG, PNG, and WEBP images into a single PDF document.' },
  { q: 'Can I reorder the images before merging?', a: 'Yes! Simply drag and drop the image thumbnails to arrange them in your preferred order before converting.' },
  { q: 'Is there a limit on the number of images?', a: 'There is no hard limit. You can add as many images as you need, though very large batches may take a moment to process.' },
  { q: 'Are my images uploaded to a server?', a: 'No. All processing happens entirely in your browser. Your images never leave your device.' },
  { q: 'What determines the PDF page size?', a: 'Each page in the output PDF matches the original dimensions of the corresponding image, so quality is preserved.' },
  { q: 'Can I rename the output PDF?', a: 'Yes. After conversion you can edit the filename before downloading.' },
];

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
    <ToolFAQ faqs={faqs} />
  </ToolPageLayout>
);

export default MergeImages;

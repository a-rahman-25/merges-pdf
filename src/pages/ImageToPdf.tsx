import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ImageToPDF from '@/components/ImageToPDF';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const ImageToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="image-to-pdf">
      <SEOHead
        title="Image to PDF — Convert JPG, PNG to PDF Free | MergesPDF"
        description="Convert JPG, PNG, and WEBP images to PDF. Drag to reorder, combine multiple images into one PDF. Free, no uploads."
        path="/image-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{tt('page.imageToPdf.h1', lang)}</h1>
        <p className="mt-2 text-muted-foreground">{tt('page.imageToPdf.sub', lang)}</p>
      </div>
      <ImageToPDF />
    </ToolPageLayout>
  );
};

export default ImageToPdf;

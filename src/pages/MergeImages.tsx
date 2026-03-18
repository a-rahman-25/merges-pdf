import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ImageToPDF from '@/components/ImageToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const MergeImages = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge-images">
      <SEOHead title="Merge Images to PDF — Combine Multiple Images into One PDF | MergesPDF" description="Merge multiple JPG, PNG, and WEBP images into a single PDF document. Drag to reorder, rename before download. Free, no uploads." path="/merge-images" />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{tt('page.mergeImages.h1', lang)}</h1>
        <p className="mt-2 text-muted-foreground">{tt('page.mergeImages.sub', lang)}</p>
      </div>
      <ImageToPDF />
      <ToolFAQ toolId="mergeImages" />
    </ToolPageLayout>
  );
};

export default MergeImages;

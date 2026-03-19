import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import MergeImagesComponent from '@/components/MergeImages';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const MergeImages = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge-images">
      <SEOHead
        title="Merge Images — Combine Multiple Images into One | MergesPDF"
        description="Combine multiple images into a single image. Horizontal, vertical, or grid layout. Free, in-browser, no uploads."
        path="/merge-images"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.mergeImages.h1', lang)} <span className="text-primary">{tt('page.mergeImages.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.mergeImages.sub', lang)}</p>
      </div>
      <MergeImagesComponent />
      <ToolFAQ toolId="mergeImages" />
    </ToolPageLayout>
  );
};

export default MergeImages;

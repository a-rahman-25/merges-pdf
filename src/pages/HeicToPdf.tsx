import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import HeicConverter from '@/components/HeicConverter';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const HeicToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="HEIC to PDF/JPG/PNG — Free Online Converter | MergesPDF"
        description="Convert HEIC/HEIF images from iPhone to JPG, PNG, or PDF. 100% in-browser, private, no uploads."
        path="/heic-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.heicToPdf.h1a', lang)} <span className="text-primary">{tt('page.heicToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.heicToPdf.sub', lang)}</p>
      </div>
      <HeicConverter />
      <ToolFAQ toolId="heicToPdf" />
    </ToolPageLayout>
  );
};

export default HeicToPdf;

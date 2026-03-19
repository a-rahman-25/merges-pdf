import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PowerPointToPDF from '@/components/PowerPointToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PowerPointToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="PowerPoint to PDF Converter — Free Online | MergesPDF"
        description="Convert PowerPoint presentations (.pptx) to PDF for free. 100% in-browser, private, no uploads."
        path="/pptx-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pptxToPdf.h1a', lang)} <span className="text-primary">{tt('page.pptxToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pptxToPdf.sub', lang)}</p>
      </div>
      <PowerPointToPDF />
      <ToolFAQ toolId="pptxToPdf" />
    </ToolPageLayout>
  );
};

export default PowerPointToPdf;

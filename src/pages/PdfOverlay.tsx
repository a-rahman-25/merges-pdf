import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFOverlay from '@/components/PDFOverlay';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfOverlay = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge">
      <SEOHead
        title="PDF Overlay — Stamp & Layer PDFs Free | MergesPDF"
        description="Overlay one PDF on top of another — add letterheads, stamps, or backgrounds. 100% in-browser."
        path="/pdf-overlay"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pdfOverlay.h1a', lang)} <span className="text-primary">{tt('page.pdfOverlay.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pdfOverlay.sub', lang)}</p>
      </div>
      <PDFOverlay />
      <ToolFAQ toolId="pdfOverlay" />
    </ToolPageLayout>
  );
};

export default PdfOverlay;

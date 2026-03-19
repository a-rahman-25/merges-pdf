import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFToPowerPoint from '@/components/PDFToPowerPoint';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfToPowerPoint = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="PDF to PowerPoint Converter — Free Online | MergesPDF"
        description="Convert PDF pages to presentation slides. 100% in-browser, private, no uploads."
        path="/pdf-to-powerpoint"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pdfToPpt.h1a', lang)} <span className="text-primary">{tt('page.pdfToPpt.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pdfToPpt.sub', lang)}</p>
      </div>
      <PDFToPowerPoint />
      <ToolFAQ toolId="pdfToPpt" />
    </ToolPageLayout>
  );
};

export default PdfToPowerPoint;

import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFComparison from '@/components/PDFComparison';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfComparison = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge">
      <SEOHead
        title="Compare PDFs — Free Online PDF Comparison | MergesPDF"
        description="Compare two PDF files side by side and see text differences. 100% in-browser, private, no uploads."
        path="/compare-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.comparePdf.h1a', lang)} <span className="text-primary">{tt('page.comparePdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.comparePdf.sub', lang)}</p>
      </div>
      <PDFComparison />
      <ToolFAQ toolId="comparePdf" />
    </ToolPageLayout>
  );
};

export default PdfComparison;

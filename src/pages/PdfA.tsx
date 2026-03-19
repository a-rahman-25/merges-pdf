import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFAConverter from '@/components/PDFAConverter';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfA = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="PDF to PDF/A Converter — Free Online | MergesPDF"
        description="Convert PDF files to PDF/A archival format for long-term preservation. 100% in-browser, private, no uploads."
        path="/pdf-a"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pdfA.h1a', lang)} <span className="text-primary">{tt('page.pdfA.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pdfA.sub', lang)}</p>
      </div>
      <PDFAConverter />
      <ToolFAQ toolId="pdfA" />
    </ToolPageLayout>
  );
};

export default PdfA;

import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFToExcel from '@/components/PDFToExcel';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfToExcel = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="PDF to Excel Converter — Extract Tables Free | MergesPDF"
        description="Extract tables and data from PDF files into Excel spreadsheets (.xlsx, .csv). 100% in-browser, private, no uploads."
        path="/pdf-to-excel"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pdfToExcel.h1a', lang)} <span className="text-primary">{tt('page.pdfToExcel.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pdfToExcel.sub', lang)}</p>
      </div>
      <PDFToExcel />
      <ToolFAQ toolId="pdfToExcel" />
    </ToolPageLayout>
  );
};

export default PdfToExcel;

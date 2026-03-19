import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ExcelToPDF from '@/components/ExcelToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const ExcelToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="Excel to PDF Converter — Free Online | MergesPDF"
        description="Convert Excel spreadsheets (.xlsx, .xls, .csv) to PDF for free. 100% in-browser, private, no uploads."
        path="/excel-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.excelToPdf.h1a', lang)} <span className="text-primary">{tt('page.excelToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.excelToPdf.sub', lang)}</p>
      </div>
      <ExcelToPDF />
      <ToolFAQ toolId="excelToPdf" />
    </ToolPageLayout>
  );
};

export default ExcelToPdf;

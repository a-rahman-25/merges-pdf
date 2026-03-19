import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFRepair from '@/components/PDFRepair';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const RepairPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="pdf-tools">
      <SEOHead
        title="Repair PDF — Fix Corrupted PDF Files Free | MergesPDF"
        description="Repair damaged or corrupted PDF files for free. Re-index pages, clean metadata, rebuild cross-references — 100% in-browser."
        path="/repair-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.repairPdf.h1a', lang)} <span className="text-primary">{tt('page.repairPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.repairPdf.sub', lang)}</p>
      </div>
      <PDFRepair />
      <ToolFAQ toolId="repairPdf" />
    </ToolPageLayout>
  );
};

export default RepairPdf;

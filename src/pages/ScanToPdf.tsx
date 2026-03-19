import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import ScanToPDF from '@/components/ScanToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const ScanToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="Scan to PDF — Camera & Image to PDF Free | MergesPDF"
        description="Scan documents with your camera or upload images to create PDF files. 100% in-browser, private, no uploads."
        path="/scan-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.scanToPdf.h1a', lang)} <span className="text-primary">{tt('page.scanToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.scanToPdf.sub', lang)}</p>
      </div>
      <ScanToPDF />
      <ToolFAQ toolId="scanToPdf" />
    </ToolPageLayout>
  );
};

export default ScanToPdf;

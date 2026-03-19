import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import EPUBToPDF from '@/components/EPUBToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const EpubToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="EPUB to PDF Converter — Free Online | MergesPDF"
        description="Convert EPUB e-books to PDF for free. Preserves chapters and reading order. 100% in-browser, private, no uploads."
        path="/epub-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.epubToPdf.h1a', lang)} <span className="text-primary">{tt('page.epubToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.epubToPdf.sub', lang)}</p>
      </div>
      <EPUBToPDF />
      <ToolFAQ toolId="epubToPdf" />
    </ToolPageLayout>
  );
};

export default EpubToPdf;

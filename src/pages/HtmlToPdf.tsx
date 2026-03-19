import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import WebpageToPDF from '@/components/WebpageToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const HtmlToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="HTML to PDF Converter — Free Online | MergesPDF"
        description="Convert HTML code or files to PDF documents for free. Paste code or upload an HTML file. 100% in-browser."
        path="/html-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.htmlToPdf.h1a', lang)} <span className="text-primary">{tt('page.htmlToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.htmlToPdf.sub', lang)}</p>
      </div>
      <WebpageToPDF />
      <ToolFAQ toolId="htmlToPdf" />
    </ToolPageLayout>
  );
};

export default HtmlToPdf;

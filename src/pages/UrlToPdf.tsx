import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import UrlToPDF from '@/components/UrlToPDF';
import ToolFAQ from '@/components/ToolFAQ';

const UrlToPdf = () => {
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="URL to PDF — Save Any Web Page as PDF Free | MergesPDF"
        description="Paste a website link and download it as a clean PDF. Free, no signup, no watermark. Works with articles, docs and blog posts."
        path="/url-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          URL to <span className="text-primary">PDF</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Paste any web page link and save it as a clean, readable PDF.</p>
      </div>
      <UrlToPDF />
      <ToolFAQ toolId="webpageToPdf" />
    </ToolPageLayout>
  );
};

export default UrlToPdf;

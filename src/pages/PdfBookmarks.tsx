import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFBookmarks from '@/components/PDFBookmarks';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PdfBookmarks = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="pdf-bookmarks">
      <SEOHead
        title="PDF Bookmarks — Add Table of Contents Free | MergesPDF"
        description="Add bookmarks and table of contents to PDF files for free. 100% in-browser, private, no uploads."
        path="/pdf-bookmarks"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pdfBookmarks.h1a', lang)} <span className="text-primary">{tt('page.pdfBookmarks.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pdfBookmarks.sub', lang)}</p>
      </div>
      <PDFBookmarks />
      <ToolFAQ toolId="pdfBookmarks" />
    </ToolPageLayout>
  );
};

export default PdfBookmarks;

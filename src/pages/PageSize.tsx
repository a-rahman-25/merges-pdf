import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFPageResize from '@/components/PDFPageResize';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const PageSize = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="page-size">
      <SEOHead
        title="Change PDF Page Size — Resize Pages Free | MergesPDF"
        description="Resize PDF pages to A4, Letter, A3, Legal, and more. 100% in-browser, private, no uploads."
        path="/page-size"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pageSize.h1a', lang)} <span className="text-primary">{tt('page.pageSize.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pageSize.sub', lang)}</p>
      </div>
      <PDFPageResize />
      <ToolFAQ toolId="pageSize" />
    </ToolPageLayout>
  );
};

export default PageSize;

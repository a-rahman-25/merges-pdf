import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import MarkdownToPDF from '@/components/MarkdownToPDF';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const MarkdownToPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="convert">
      <SEOHead
        title="Markdown to PDF Converter — Free Online | MergesPDF"
        description="Convert Markdown text or .md files to beautifully formatted PDF. 100% in-browser, private."
        path="/markdown-to-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.markdownToPdf.h1a', lang)} <span className="text-primary">{tt('page.markdownToPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.markdownToPdf.sub', lang)}</p>
      </div>
      <MarkdownToPDF />
      <ToolFAQ toolId="markdownToPdf" />
    </ToolPageLayout>
  );
};

export default MarkdownToPdf;

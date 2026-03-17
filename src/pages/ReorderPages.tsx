import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFPageReorder from '@/components/PDFPageReorder';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const ReorderPages = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="reorder-pages">
      <SEOHead
        title="Reorder PDF Pages — Drag & Drop Free | MergesPDF"
        description="Rearrange PDF pages with drag-and-drop. Reorder pages in any order and save. Free, no uploads."
        path="/reorder-pages"
      />
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{tt('page.reorderPages.h1', lang)}</h1>
        <p className="mt-2 text-muted-foreground">{tt('page.reorderPages.sub', lang)}</p>
      </div>
      <PDFPageReorder />
    </ToolPageLayout>
  );
};

export default ReorderPages;

import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFPageReorder from '@/components/PDFPageReorder';

const ReorderPages = () => (
  <ToolPageLayout activeTab="reorder-pages">
    <SEOHead
      title="Reorder PDF Pages — Drag & Drop Free | MergesPDF"
      description="Rearrange PDF pages with drag-and-drop. Reorder pages in any order and save. Free, no uploads."
      path="/reorder-pages"
    />
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Reorder PDF Pages</h1>
      <p className="mt-2 text-muted-foreground">Drag and drop to rearrange pages in your PDF document.</p>
    </div>
    <PDFPageReorder />
  </ToolPageLayout>
);

export default ReorderPages;

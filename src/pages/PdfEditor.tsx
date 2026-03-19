import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFEditor from '@/components/PDFEditor';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const PdfEditorPage = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge">
      <SEOHead
        title="PDF Editor — Annotate, Draw & Edit PDFs Free | MergesPDF"
        description="Edit PDFs in your browser — add text, highlights, drawings, shapes, sticky notes and images. 100% private, free."
        path="/pdf-editor"
      />
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.pdfEditor.h1a', lang)} <span className="gradient-text">{tt('page.pdfEditor.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.pdfEditor.sub', lang)}</p>
      </div>
      <PDFEditor />
      <ToolFAQ toolId="pdfEditor" />
    </ToolPageLayout>
  );
};

export default PdfEditorPage;

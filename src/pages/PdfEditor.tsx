import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import PDFEditor from '@/components/PDFEditor';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What can I do with the PDF Editor?', a: 'Add text, highlights, freehand drawings, lines, arrows, rectangles, circles, sticky notes, and images to any PDF page.' },
  { q: 'Is editing done locally?', a: 'Yes! All rendering and editing happens in your browser. Your PDF never leaves your device.' },
  { q: 'Can I undo my changes?', a: 'Yes — use Ctrl+Z to undo and Ctrl+Y to redo. The editor maintains a full undo/redo history.' },
  { q: 'Will my annotations be part of the PDF?', a: 'Yes. When you save, all annotations are permanently embedded into the PDF as proper PDF elements.' },
  { q: 'Can I edit text already in the PDF?', a: 'The editor focuses on adding annotations over the PDF. To edit existing text, you may need a desktop tool like LibreOffice.' },
];

const PdfEditor = () => (
  <ToolPageLayout activeTab="merge">
    <SEOHead
      title="PDF Editor — Annotate, Draw & Edit PDFs Free | MergesPDF"
      description="Edit PDFs in your browser — add text, highlights, drawings, shapes, sticky notes and images. 100% private, free."
      path="/pdf-editor"
    />
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        PDF <span className="gradient-text">Editor</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Add text, highlights, drawings, shapes, and images to your PDFs.</p>
    </div>
    <PDFEditor />
    <ToolFAQ faqs={faqs} />
  </ToolPageLayout>
);

export default PdfEditor;

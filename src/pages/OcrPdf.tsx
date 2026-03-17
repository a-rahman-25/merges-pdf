import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import OCRTool from '@/components/OCRTool';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { question: 'What is OCR?', answer: 'OCR (Optical Character Recognition) converts images of text into machine-readable text, making scanned documents searchable and editable.' },
  { question: 'What languages are supported?', answer: 'English, Spanish, French, German, Portuguese, Arabic, Chinese (Simplified), Hindi, and Japanese.' },
  { question: 'Is OCR processing done locally?', answer: 'Yes! Tesseract.js runs entirely in your browser. Your files never leave your device.' },
  { question: 'How long does OCR take?', answer: 'Processing time depends on page count and complexity. Most single-page documents complete in under 10 seconds.' },
  { question: 'Can I OCR a scanned PDF?', answer: 'Yes! Upload a scanned PDF and the tool will render each page, then extract text using OCR.' },
];

const OcrPdf = () => (
  <ToolPageLayout activeTab="merge">
    <SEOHead
      title="OCR PDF — Extract Text from Scanned PDFs Free | MergesPDF"
      description="Convert scanned PDFs and images to searchable text using OCR. 100% in-browser, private, free."
      path="/ocr-pdf"
    />
    <div className="mb-6 text-center">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        OCR — Extract Text from <span className="gradient-text">Scanned PDFs</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Convert scanned documents and images into searchable, editable text.</p>
    </div>
    <OCRTool />
    <ToolFAQ faqs={faqs} />
  </ToolPageLayout>
);

export default OcrPdf;

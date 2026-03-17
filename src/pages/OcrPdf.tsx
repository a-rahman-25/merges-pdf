import SEOHead from '@/components/SEOHead';
import ToolPageLayout from '@/components/ToolPageLayout';
import OCRTool from '@/components/OCRTool';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';

const faqs = [
  { q: 'What is OCR?', a: 'OCR (Optical Character Recognition) converts images of text into machine-readable text, making scanned documents searchable and editable.' },
  { q: 'What languages are supported?', a: 'English, Spanish, French, German, Portuguese, Arabic, Chinese (Simplified), Hindi, and Japanese.' },
  { q: 'Is OCR processing done locally?', a: 'Yes! Tesseract.js runs entirely in your browser. Your files never leave your device.' },
  { q: 'How long does OCR take?', a: 'Processing time depends on page count and complexity. Most single-page documents complete in under 10 seconds.' },
  { q: 'Can I OCR a scanned PDF?', a: 'Yes! Upload a scanned PDF and the tool will render each page, then extract text using OCR.' },
];

const OcrPdf = () => {
  const { lang } = useI18n();
  return (
    <ToolPageLayout activeTab="merge">
      <SEOHead
        title="OCR PDF — Extract Text from Scanned PDFs Free | MergesPDF"
        description="Convert scanned PDFs and images to searchable text using OCR. 100% in-browser, private, free."
        path="/ocr-pdf"
      />
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {tt('page.ocrPdf.h1a', lang)} <span className="gradient-text">{tt('page.ocrPdf.h1b', lang)}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{tt('page.ocrPdf.sub', lang)}</p>
      </div>
      <OCRTool />
      <ToolFAQ faqs={faqs} />
    </ToolPageLayout>
  );
};

export default OcrPdf;

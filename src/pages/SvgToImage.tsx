import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SVGConverter from '@/components/SVGConverter';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What image formats can I convert SVG to?', a: 'You can convert to PNG, JPG, WEBP, and BMP — all processed in your browser.' },
  { q: 'Will I lose quality?', a: 'SVGs are vector-based so they scale perfectly. Choose a higher scale (2x–4x) for crisp high-resolution output.' },
  { q: 'Is my SVG uploaded to a server?', a: 'No. Everything runs 100% in your browser. Your files never leave your device.' },
  { q: 'Can I convert SVGs with transparency?', a: 'Yes! PNG and WEBP preserve transparency. JPG and BMP will have a white background.' },
];

const SvgToImage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="SVG to Image Converter — Free Online PNG, JPG, WEBP | MergesPDF"
      description="Convert SVG files to PNG, JPG, WEBP or BMP instantly in your browser. Choose scale, format, and download — 100% private, no uploads."
      path="/svg-to-image"
      faqs={faqs}
    />
    <Header />
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">
        SVG to Image Converter
      </h1>
      <p className="mt-3 text-muted-foreground">
        Convert any SVG file to PNG, JPG, WEBP, or BMP — pick your format and scale. 100% browser-based, your files never leave your device.
      </p>
      <div className="mt-8">
        <SVGConverter />
      </div>
      <div className="mt-16">
        <ToolFAQ faqs={faqs} />
      </div>
    </main>
    <Footer />
  </div>
);

export default SvgToImage;

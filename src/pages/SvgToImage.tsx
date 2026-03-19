import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SVGConverter from '@/components/SVGConverter';
import ToolFAQ from '@/components/ToolFAQ';
import { useI18n } from '@/hooks/useI18n';
import { tt } from '@/lib/tool-translations';


const SvgToImage = () => {
  const { lang } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="SVG to Image Converter — Free Online PNG, JPG, WEBP | MergesPDF"
        description="Convert SVG files to PNG, JPG, WEBP or BMP instantly in your browser. Choose scale, format, and download — 100% private, no uploads."
        path="/svg-to-image"
      />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-extrabold text-foreground md:text-4xl">
          {tt('page.svgToImage.h1', lang)}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {tt('page.svgToImage.sub', lang)}
        </p>
        <div className="mt-8">
          <SVGConverter />
        </div>
        <div className="mt-16">
          <ToolFAQ toolId="svgToImage" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SvgToImage;

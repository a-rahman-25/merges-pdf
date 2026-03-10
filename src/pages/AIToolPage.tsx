import { useLocation } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIDocumentTool from '@/components/AIDocumentTool';
import ToolFAQ from '@/components/ToolFAQ';
import { getToolBySlug } from '@/lib/ai-tools-config';
import NotFound from '@/pages/NotFound';

const AIToolPage = () => {
  const location = useLocation();
  const slug = location.pathname.slice(1); // remove leading /
  const tool = getToolBySlug(slug);

  if (!tool) return <NotFound />;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.metaDescription,
    url: `https://mergespdf.com/${tool.slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <>
      <SEOHead
        title={`${tool.title} — Free Online | MergesPDF`}
        description={tool.metaDescription}
        path={`/${tool.slug}`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{tool.title}</h1>
            <p className="mt-2 text-muted-foreground">{tool.description}</p>
          </div>

          <AIDocumentTool tool={tool} />

          {tool.faqs.length > 0 && <ToolFAQ faqs={tool.faqs} />}
        </main>

        <footer className="border-t border-border/60 py-10">
          <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
            <p>Built with care · No data leaves your device · 100% Free</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AIToolPage;

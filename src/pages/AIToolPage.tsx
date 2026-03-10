import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Combine } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import ThemeToggle from '@/components/ThemeToggle';
import AIDocumentTool from '@/components/AIDocumentTool';
import ToolFAQ from '@/components/ToolFAQ';
import { getToolBySlug } from '@/lib/ai-tools-config';
import NotFound from '@/pages/NotFound';

const AIToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

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
        <header className="border-b border-border/60">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Combine className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">MergesPDF</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/ai-document-tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All AI Tools
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

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

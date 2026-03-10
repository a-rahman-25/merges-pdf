import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { aiTools, aiToolCategories } from '@/lib/ai-tools-config';
import { useState } from 'react';

const AIDocumentTools = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory ? aiTools.filter(t => t.category === activeCategory) : aiTools;

  return (
    <>
      <SEOHead
        title="AI Document Intelligence Tools — Free Online | MergesPDF"
        description="40 free AI-powered document tools: summarize, extract, analyze, generate, and transform documents instantly. No sign-up required."
        path="/ai-document-tools"
      />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              AI Document Intelligence Tools
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              40 free AI-powered tools to analyze, extract, generate, and transform your documents. No sign-up required.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-xl border border-border bg-card p-1.5">
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded-lg px-4 py-2 text-sm font-display font-semibold transition-all ${!activeCategory ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
              >
                All ({aiTools.length})
              </button>
              {aiToolCategories.map(cat => {
                const count = aiTools.filter(t => t.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-display font-semibold transition-all ${activeCategory === cat.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tool, i) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  to={`/${tool.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all h-full"
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tool.color}`}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">{tool.description}</p>
                  <span className="mt-3 text-xs font-medium text-primary">Use Free →</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Privacy Notice */}
          <div className="mt-16 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 All uploaded files are automatically deleted after processing to protect your privacy. No data is stored.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AIDocumentTools;

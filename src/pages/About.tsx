import { Link } from 'react-router-dom';
import { Combine, Shield, Zap, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import SEOHead from '@/components/SEOHead';

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="About MergePDF — Free, Private PDF Tools"
      description="Learn about MergePDF — a free, privacy-first PDF tools platform. All processing happens in your browser. No uploads, no sign-up, no fees."
      path="/about"
    />

    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Combine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MergePDF</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">About</Link>
          <Link to="/contact" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Contact</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          About <span className="text-primary">MergePDF</span>
        </h1>

        <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            MergePDF was built with a simple mission: <strong className="text-foreground">give everyone access to powerful PDF tools — completely free, with zero compromises on privacy.</strong>
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: Shield, title: 'Privacy First', desc: 'Every file you process stays on your device. We never upload, store, or even see your documents.' },
              { icon: Zap, title: 'Instant Processing', desc: 'No waiting for server queues. Everything runs in your browser, powered by your own device.' },
              { icon: Globe, title: 'Works Everywhere', desc: 'Use it on any device with a browser — desktop, tablet, or phone. Works offline too.' },
              { icon: Heart, title: 'Truly Free', desc: 'No subscriptions, no premium tiers, no watermarks, no hidden fees. Not a single cent, ever.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <item.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Why we built this</h2>
            <p>
              Most online PDF tools either charge money for basic features, plaster ads everywhere, or — worst of all — upload your private documents to their servers. We thought there had to be a better way.
            </p>
            <p>
              Modern browsers are incredibly powerful. They can process PDFs, convert images, and even run AI models — all without sending a single byte to a server. MergePDF harnesses that power to give you fast, private, and free PDF tools.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">How it works</h2>
            <p>
              When you use MergePDF, your files are processed entirely within your web browser using client-side JavaScript. There is no backend server, no database, and no file storage. When you close the tab, your files are gone — because they were never anywhere else.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-foreground font-medium">Have questions or feedback?</p>
            <p className="mt-1 text-sm">
              Reach us at{' '}
              <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">
                merge.pdf.st@gmail.com
              </a>{' '}
              or visit our{' '}
              <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
            </p>
          </div>
        </div>
      </motion.div>
    </main>

    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Combine className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">MergePDF</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
          </div>
        </div>
        <div className="mt-6 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
          <p>Built with care · No data leaves your device · 100% Free</p>
          <p className="mt-1">
            Support: <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default About;

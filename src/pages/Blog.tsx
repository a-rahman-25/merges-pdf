import { Link } from 'react-router-dom';
import { Combine, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import SEOHead from '@/components/SEOHead';

const posts = [
  {
    title: 'How to Merge PDF Files for Free — A Complete Guide',
    excerpt: 'Learn how to combine multiple PDF documents into one file using MergePDF. No uploads, no sign-up, completely free.',
    date: 'March 2025',
    slug: '#',
  },
  {
    title: '5 Ways to Reduce PDF File Size Without Losing Quality',
    excerpt: 'Large PDFs slowing you down? Here are 5 practical tips to compress your PDF files while keeping them looking great.',
    date: 'March 2025',
    slug: '#',
  },
  {
    title: 'Why Client-Side PDF Processing Is the Future of Privacy',
    excerpt: 'Most PDF tools upload your files to their servers. Learn why browser-based processing is safer — and how MergePDF does it differently.',
    date: 'February 2025',
    slug: '#',
  },
  {
    title: 'PDF to Image: When and Why You Should Convert',
    excerpt: "Sometimes a PDF isn't the right format. Learn when converting to PNG, JPG, or WEBP makes more sense and how to do it.",
    date: 'February 2025',
    slug: '#',
  },
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="MergePDF Blog — PDF Tips, Guides & Privacy"
      description="Tips, guides, and insights about PDF tools, file privacy, and getting the most out of MergePDF's free online tools."
      path="/blog"
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
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tips, guides, and insights about PDF tools and file privacy.
        </p>

        <div className="mt-12 space-y-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card/50 p-6 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">More articles coming soon!</p>
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

export default Blog;

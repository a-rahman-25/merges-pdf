import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Combine, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
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

      <main className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h1 className="font-display text-7xl font-bold text-primary md:text-8xl">404</h1>
          <p className="mt-4 text-xl font-medium text-foreground">Page not found</p>
          <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          <Button asChild size="lg" className="mt-8 rounded-xl px-8">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;

import { Link } from 'react-router-dom';
import { Combine } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border/60 py-10">
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Combine className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">MergesPDF</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/ai-document-tools" className="hover:text-foreground">AI Tools</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
      <div className="mt-6 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
        <p>All files are automatically deleted after processing to protect your privacy.</p>
        <p className="mt-1">Built with care · 100% Free · No sign-up required</p>
        <p className="mt-1">
          Support: <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

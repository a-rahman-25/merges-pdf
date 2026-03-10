import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import ThemeToggle from '@/components/ThemeToggle';
import { Combine, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Privacy Policy — MergesPDF.com | Free PDF Tools"
      description="Read the MergesPDF.com privacy policy. Learn how we protect your data — all files are processed in your browser and automatically deleted."
      path="/privacy"
    />
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Combine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MergesPDF</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>

    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: March 10, 2026</p>

      <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">1. Overview</h2>
          <p className="mt-2">MergesPDF.com ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our free PDF tools at mergespdf.com.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">2. Files You Upload</h2>
          <p className="mt-2"><strong className="text-foreground">Your files never leave your browser.</strong> All PDF processing (merge, split, compress, convert, rotate, etc.) is performed entirely in your web browser using client-side JavaScript. No files are uploaded to our servers.</p>
          <p className="mt-2">For AI-powered features (summarize, translate, Q&A), a text representation of your document is sent to our secure backend for processing. <strong className="text-foreground">All data is automatically deleted immediately after processing.</strong> We do not store, log, or retain any file content.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">3. No Account Required</h2>
          <p className="mt-2">MergesPDF.com does not require you to create an account, sign in, or provide any personal information to use our tools. You can use every feature anonymously.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">4. Information We Collect</h2>
          <p className="mt-2">We may collect anonymous, non-personal usage data such as:</p>
          <ul className="mt-2 ml-6 list-disc space-y-1">
            <li>Page views and tool usage statistics (anonymous)</li>
            <li>Browser type and device category</li>
            <li>Referring website</li>
            <li>Country-level location (not precise)</li>
          </ul>
          <p className="mt-2">This data is collected through standard analytics tools and contains no personally identifiable information.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">5. Cookies</h2>
          <p className="mt-2">We use minimal cookies for essential functionality (theme preference) and analytics. We do not use tracking cookies for advertising purposes.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">6. Third-Party Services</h2>
          <p className="mt-2">We may display non-intrusive advertisements through third-party ad networks. These services may use their own cookies. Please refer to their respective privacy policies for more information.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">7. Data Security</h2>
          <p className="mt-2">We implement industry-standard security measures. Since files are processed locally in your browser, the risk of data breach is minimized. For AI features, all data transmission is encrypted via HTTPS/TLS.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">8. Children's Privacy</h2>
          <p className="mt-2">Our services are not directed to children under 13. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">9. Changes to This Policy</h2>
          <p className="mt-2">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">10. Contact Us</h2>
          <p className="mt-2">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a> or visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
        </section>
      </div>
    </motion.main>

    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p>© {new Date().getFullYear()} MergesPDF.com — All rights reserved</p>
      </div>
    </footer>
  </div>
);

export default PrivacyPolicy;

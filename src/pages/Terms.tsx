import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Terms of Service — MergesPDF.com | Free PDF Tools"
      description="Read the MergesPDF.com terms of service. Free PDF tools with no sign-up, no payments, and complete privacy."
      path="/terms"
    />
    <Header />

    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold text-foreground">Terms of Service</h1>
      <p className="mt-2 text-muted-foreground">Last updated: March 10, 2026</p>

      <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">By accessing and using MergesPDF.com ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">2. Service Description</h2>
          <p className="mt-2">MergesPDF.com provides free online PDF tools including but not limited to: merging, splitting, compressing, converting, rotating, encrypting, and editing PDF files. All tools are provided free of charge with no account registration required.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">3. Free Service</h2>
          <p className="mt-2">All features on MergesPDF.com are completely free. We do not charge any fees, require subscriptions, or impose usage limits. The Service is funded through non-intrusive advertising and optional donations.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">4. User Responsibilities</h2>
          <p className="mt-2">You agree to:</p>
          <ul className="mt-2 ml-6 list-disc space-y-1">
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to disrupt or compromise the Service</li>
            <li>Not use automated tools to excessively access the Service</li>
            <li>Not upload files containing malware or malicious content</li>
            <li>Ensure you have the right to process any files you upload</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">5. Privacy & File Handling</h2>
          <p className="mt-2">Most PDF processing occurs entirely in your browser. Files processed client-side are never uploaded to our servers. For AI-powered features, data is processed securely and deleted immediately after processing. See our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">6. Intellectual Property</h2>
          <p className="mt-2">The Service, including its design, code, and branding, is the property of MergesPDF.com. You retain full ownership of any files you process using our tools.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">7. Disclaimer of Warranties</h2>
          <p className="mt-2">The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or that results will be accurate. Use the Service at your own risk.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
          <p className="mt-2">MergesPDF.com shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to data loss or file corruption.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">9. Changes to Terms</h2>
          <p className="mt-2">We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">10. Contact</h2>
          <p className="mt-2">For questions about these Terms, contact us at <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>.</p>
        </section>
      </div>
    </motion.main>

    <Footer />
  </div>
);

export default Terms;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Combine, ChevronRight, Shield, Zap, Lock } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

interface LandingPageData {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  h1: string;
  h1Highlight: string;
  subtitle: string;
  toolPath: string;
  toolCta: string;
  features: string[];
  howTo: { step: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const landingPages: LandingPageData[] = [
  {
    slug: 'merge-pdf-online-free',
    title: 'Merge PDF Online Free',
    seoTitle: 'Merge PDF Online Free — Combine PDF Files Instantly | MergesPDF',
    description: 'Merge PDF files online for free. Combine multiple PDFs into one document in seconds. No sign-up, no uploads to servers, 100% private.',
    h1: 'Merge PDF', h1Highlight: 'Online Free',
    subtitle: 'Combine multiple PDF files into a single document instantly. No sign-up, no file limits, 100% free.',
    toolPath: '/merge', toolCta: 'Merge PDFs Now — Free',
    features: ['Combine unlimited PDF files', 'Drag & drop reordering', 'No watermarks on output', 'No file size limits', 'No account required', 'Works on all devices'],
    howTo: [
      { step: 'Upload PDFs', desc: 'Drag and drop your PDF files or click to select them from your device.' },
      { step: 'Arrange order', desc: 'Drag files to reorder them. The merged PDF will follow this order.' },
      { step: 'Merge & Download', desc: 'Click merge, review the summary, then download your combined PDF.' },
    ],
    faqs: [
      { q: 'Can I merge PDFs online for free?', a: 'Yes! MergesPDF lets you merge unlimited PDF files completely free with no watermarks or sign-up.' },
      { q: 'Is it safe to merge PDFs online?', a: 'Absolutely. All processing happens in your browser — files never leave your device.' },
      { q: 'How many PDFs can I merge at once?', a: 'There is no limit. You can merge as many PDF files as your device can handle.' },
      { q: 'Do merged PDFs have watermarks?', a: 'No. The output is clean with zero watermarks or branding.' },
    ],
  },
  {
    slug: 'compress-pdf-free',
    title: 'Compress PDF Free',
    seoTitle: 'Compress PDF Free Online — Reduce PDF Size | MergesPDF',
    description: 'Compress PDF files free online. Reduce PDF size without losing quality. No sign-up, no uploads, instant processing in your browser.',
    h1: 'Compress PDF', h1Highlight: 'Free Online',
    subtitle: 'Reduce PDF file size without quality loss. Instant browser-based compression — no uploads, no limits.',
    toolPath: '/compress', toolCta: 'Compress PDF Now — Free',
    features: ['Reduce file size by up to 50%', 'No quality loss', 'Instant processing', 'No file size limits', 'No sign-up required', 'Private — files stay on your device'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select or drag your PDF file into the tool.' },
      { step: 'Compress', desc: 'Click compress. The tool optimizes your PDF instantly.' },
      { step: 'Download', desc: 'Review the size reduction, then download your smaller PDF.' },
    ],
    faqs: [
      { q: 'How to compress PDF without losing quality?', a: 'MergesPDF compresses by removing metadata and optimizing structure, keeping visual quality intact.' },
      { q: 'Is PDF compression free?', a: 'Yes, completely free with no limits on file size or number of compressions.' },
      { q: 'How much can I reduce PDF size?', a: 'Typical reductions are 10-50%, depending on the PDF content and metadata.' },
    ],
  },
  {
    slug: 'pdf-to-word-converter-free',
    title: 'PDF to Word Converter Free',
    seoTitle: 'PDF to Word Converter Free Online — Convert PDF to DOCX | MergesPDF',
    description: 'Convert PDF to Word (.docx) free online. No sign-up, no file uploads to servers. Fast browser-based PDF to Word conversion.',
    h1: 'PDF to Word', h1Highlight: 'Converter Free',
    subtitle: 'Convert PDF documents to editable Word files in seconds. Free, private, no sign-up.',
    toolPath: '/pdf-to-word', toolCta: 'Convert PDF to Word — Free',
    features: ['Convert to .docx format', 'No sign-up needed', 'Private — browser-based', 'Works on any device', 'No watermarks', 'Instant conversion'],
    howTo: [
      { step: 'Select PDF', desc: 'Choose the PDF file you want to convert to Word.' },
      { step: 'Convert', desc: 'Click convert. The tool creates a Word document instantly.' },
      { step: 'Download', desc: 'Review the output summary, then download your .docx file.' },
    ],
    faqs: [
      { q: 'Can I convert PDF to Word free?', a: 'Yes. MergesPDF converts PDF to Word format completely free with no limits.' },
      { q: 'Is the conversion accurate?', a: 'The converter extracts document structure. Text-based PDFs convert well; complex layouts may need minor adjustments.' },
      { q: 'What format is the output?', a: 'The output is .docx format, compatible with Microsoft Word, Google Docs, and LibreOffice.' },
    ],
  },
  {
    slug: 'split-pdf-online',
    title: 'Split PDF Online',
    seoTitle: 'Split PDF Online Free — Extract Pages from PDF | MergesPDF',
    description: 'Split PDF files online for free. Extract specific pages or split into individual page files. No sign-up, instant processing.',
    h1: 'Split PDF', h1Highlight: 'Online Free',
    subtitle: 'Split PDFs into individual pages or extract custom page ranges. Fast, free, private.',
    toolPath: '/split', toolCta: 'Split PDF Now — Free',
    features: ['Split into individual pages', 'Extract page ranges', 'No file limits', 'Browser-based processing', 'No account needed', 'Download individual pages'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select the PDF you want to split.' },
      { step: 'Choose mode', desc: 'Split all pages or specify a custom page range.' },
      { step: 'Download', desc: 'Download individual pages or the extracted range.' },
    ],
    faqs: [
      { q: 'How to split a PDF into separate pages?', a: 'Upload your PDF, select "All Pages" mode, and each page will be available as a separate download.' },
      { q: 'Can I extract specific pages from a PDF?', a: 'Yes. Use the Page Range mode and enter pages like "1-3, 5, 8-10".' },
    ],
  },
  {
    slug: 'rotate-pdf-pages',
    title: 'Rotate PDF Pages',
    seoTitle: 'Rotate PDF Pages Online Free — 90° 180° 270° | MergesPDF',
    description: 'Rotate PDF pages by 90°, 180°, or 270° online for free. Fix upside-down or sideways pages instantly in your browser.',
    h1: 'Rotate PDF', h1Highlight: 'Pages Free',
    subtitle: 'Fix upside-down or sideways PDF pages. Rotate by 90°, 180°, or 270° with one click.',
    toolPath: '/rotate', toolCta: 'Rotate PDF Pages — Free',
    features: ['Rotate 90°, 180°, or 270°', 'All pages at once', 'Instant processing', 'No quality loss', 'Free, no sign-up', 'Works on mobile'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select the PDF with pages that need rotating.' },
      { step: 'Choose angle', desc: 'Select 90°, 180°, or 270° rotation.' },
      { step: 'Download', desc: 'Review the result and download your rotated PDF.' },
    ],
    faqs: [
      { q: 'Can I rotate PDF pages for free?', a: 'Yes. MergesPDF rotates all pages in your PDF completely free.' },
      { q: 'Will rotation affect PDF quality?', a: 'No. The rotation is lossless — content quality remains identical.' },
    ],
  },
  {
    slug: 'jpg-to-pdf-converter',
    title: 'JPG to PDF Converter',
    seoTitle: 'JPG to PDF Converter Free — Convert Images to PDF | MergesPDF',
    description: 'Convert JPG, PNG, and WEBP images to PDF for free. Combine multiple images into one PDF document. No sign-up needed.',
    h1: 'JPG to PDF', h1Highlight: 'Converter Free',
    subtitle: 'Convert images (JPG, PNG, WEBP) to PDF documents. Combine multiple images into one PDF.',
    toolPath: '/convert', toolCta: 'Convert Images to PDF — Free',
    features: ['JPG, PNG, WEBP support', 'Multiple images to one PDF', 'High quality output', 'No file limits', 'Browser-based', 'No sign-up'],
    howTo: [
      { step: 'Select images', desc: 'Choose JPG, PNG, or WEBP files to convert.' },
      { step: 'Convert', desc: 'The tool creates a PDF from your images instantly.' },
      { step: 'Download', desc: 'Download your new PDF document.' },
    ],
    faqs: [
      { q: 'How to convert JPG to PDF?', a: 'Upload your JPG image to MergesPDF\'s converter, select "Images → PDF" mode, and download the result.' },
      { q: 'Can I combine multiple images into one PDF?', a: 'Yes. Upload multiple images and they\'ll be combined into a single PDF document.' },
    ],
  },
  {
    slug: 'protect-pdf-with-password',
    title: 'Protect PDF with Password',
    seoTitle: 'Protect PDF with Password Free — Encrypt PDF Online | MergesPDF',
    description: 'Protect PDF files with password encryption for free. Secure your documents online without sign-up. Privacy-first, browser-based.',
    h1: 'Protect PDF', h1Highlight: 'with Password',
    subtitle: 'Add password protection to your PDF files. Encrypt documents for free in your browser.',
    toolPath: '/encrypt', toolCta: 'Protect PDF — Free',
    features: ['Password protection', 'Browser-based encryption', 'No file uploads', 'No account needed', 'Free, no limits', 'Secure processing'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select the PDF you want to protect.' },
      { step: 'Set password', desc: 'Enter and confirm your chosen password.' },
      { step: 'Download', desc: 'Download your password-protected PDF.' },
    ],
    faqs: [
      { q: 'Can I password-protect a PDF for free?', a: 'Yes. MergesPDF adds password protection to PDFs completely free.' },
      { q: 'Is the encryption secure?', a: 'Browser-based encryption has limitations. For maximum security, use a desktop tool with the password you set.' },
    ],
  },
  {
    slug: 'delete-pdf-pages',
    title: 'Delete PDF Pages',
    seoTitle: 'Delete PDF Pages Online Free — Remove Pages from PDF | MergesPDF',
    description: 'Delete specific pages from PDF files online for free. Remove unwanted pages instantly in your browser. No sign-up required.',
    h1: 'Delete PDF', h1Highlight: 'Pages Free',
    subtitle: 'Remove specific pages from any PDF. Enter page numbers to delete and download the result.',
    toolPath: '/delete-pages', toolCta: 'Delete Pages — Free',
    features: ['Remove specific pages', 'Page range support', 'Instant processing', 'No quality loss', 'Free, no sign-up', 'Privacy-first'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select the PDF with pages to remove.' },
      { step: 'Enter pages', desc: 'Type page numbers to delete (e.g., "1-3, 5").' },
      { step: 'Download', desc: 'Review and download your trimmed PDF.' },
    ],
    faqs: [
      { q: 'Can I remove pages from a PDF for free?', a: 'Yes. Enter the page numbers you want to delete and download the result.' },
      { q: 'Is the remaining content affected?', a: 'No. Only the specified pages are removed; all other content stays intact.' },
    ],
  },
  {
    slug: 'add-watermark-to-pdf',
    title: 'Add Watermark to PDF',
    seoTitle: 'Add Watermark to PDF Free — Text Watermark Tool | MergesPDF',
    description: 'Add text watermarks to PDF files for free. Customize text, size, and opacity. No sign-up, browser-based processing.',
    h1: 'Add Watermark', h1Highlight: 'to PDF Free',
    subtitle: 'Stamp text watermarks on every page of your PDF. Customize text, size, and opacity.',
    toolPath: '/add-watermark', toolCta: 'Add Watermark — Free',
    features: ['Custom watermark text', 'Adjustable font size', 'Opacity control', 'All pages watermarked', 'Free, no limits', 'Browser-based'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select the PDF to watermark.' },
      { step: 'Customize', desc: 'Set your watermark text, font size, and opacity.' },
      { step: 'Download', desc: 'Review and download your watermarked PDF.' },
    ],
    faqs: [
      { q: 'Can I add a watermark to PDF for free?', a: 'Yes. Customize the text, size, and opacity, then download — completely free.' },
      { q: 'Is the watermark on every page?', a: 'Yes, the watermark is applied to all pages of the PDF.' },
    ],
  },
  {
    slug: 'pdf-to-jpg-converter',
    title: 'PDF to JPG Converter',
    seoTitle: 'PDF to JPG Converter Free — Convert PDF to Images | MergesPDF',
    description: 'Convert PDF pages to JPG images for free. Extract images from PDF documents instantly in your browser. No sign-up needed.',
    h1: 'PDF to JPG', h1Highlight: 'Converter Free',
    subtitle: 'Convert PDF pages to high-quality JPG images. Free, instant, browser-based.',
    toolPath: '/convert', toolCta: 'Convert PDF to JPG — Free',
    features: ['High quality JPG output', 'Convert all pages', 'Instant processing', 'No file limits', 'No sign-up', 'Works on mobile'],
    howTo: [
      { step: 'Upload PDF', desc: 'Select the PDF you want to convert to images.' },
      { step: 'Convert', desc: 'Choose PDF → Images mode and convert.' },
      { step: 'Download', desc: 'Download your JPG images.' },
    ],
    faqs: [
      { q: 'How to convert PDF to JPG?', a: 'Upload your PDF, select the PDF to Images option, and download the resulting JPG files.' },
      { q: 'Is PDF to JPG conversion free?', a: 'Yes, completely free with no watermarks or limits.' },
    ],
  },
];

interface SEOLandingPageProps {
  page: LandingPageData;
}

const SEOLandingPage = ({ page }: SEOLandingPageProps) => (
  <div className="min-h-screen bg-background">
    <SEOHead title={page.seoTitle} description={page.description} path={`/tools/${page.slug}`} faqs={page.faqs} />

    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"><Combine className="h-5 w-5 text-primary-foreground" /></div>
          <span className="font-display text-xl font-bold text-foreground">MergesPDF</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>

    {/* Hero */}
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" /> 100% Free · No Sign-Up · Private
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          {page.h1} <span className="text-primary">{page.h1Highlight}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{page.subtitle}</p>
        <Button asChild size="lg" className="mt-8 rounded-xl px-8 text-base font-semibold">
          <Link to={page.toolPath}>{page.toolCta} <ChevronRight className="ml-1 h-5 w-5" /></Link>
        </Button>
      </motion.div>
    </section>

    {/* Features */}
    <section className="border-t border-border/60 bg-card/50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">Features</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How To */}
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">How to {page.title}</h2>
        <div className="mt-8 space-y-6">
          {page.howTo.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{i + 1}</div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{step.step}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Trust */}
    <section className="border-t border-border/60 bg-card/50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Shield, t: '100% Private', d: 'Files processed in your browser. Never uploaded.' },
            { icon: Zap, t: 'Lightning Fast', d: 'Instant processing, no server queues.' },
            { icon: Lock, t: 'No Sign-Up', d: 'Use every tool without creating an account.' },
          ].map(item => (
            <div key={item.t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <item.icon className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-display font-semibold text-foreground">{item.t}</p>
                <p className="text-sm text-muted-foreground">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">FAQ</h2>
        <div className="mt-8 space-y-4">
          {page.faqs.map(faq => (
            <details key={faq.q} className="group rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer items-center justify-between p-5 font-display font-semibold text-foreground">
                {faq.q}
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-5 pb-5 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="border-t border-border/60 bg-primary/5 py-14 text-center">
      <h2 className="font-display text-3xl font-bold text-foreground">{page.title} — It's Free</h2>
      <p className="mt-3 text-muted-foreground">No sign-up, no limits, no catches.</p>
      <Button asChild size="lg" className="mt-6 rounded-xl px-8 text-base font-semibold">
        <Link to={page.toolPath}>Get Started Free <ChevronRight className="ml-1 h-5 w-5" /></Link>
      </Button>
    </section>

    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
        <p>© {new Date().getFullYear()} MergesPDF.com — All tools free, forever.</p>
      </div>
    </footer>
  </div>
);

export default SEOLandingPage;

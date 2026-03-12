import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Combine, Scissors, Minimize2, ArrowRightLeft, RotateCw, Eraser,
  Upload, Cpu, Download, Shield, Zap, Globe, Lock, Layers, FileText,
  Code, ChevronRight, Star, MessageSquare, Droplets, Trash2, FileOutput, Brain, Languages, Palette, Hash, Unlock
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const toolCategories = [
  {
    label: 'PDF Tools',
    tools: [
      { icon: Combine, title: 'Merge PDFs', desc: 'Combine multiple PDF files into one document with drag-to-reorder.', path: '/merge', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: Scissors, title: 'Split PDFs', desc: 'Split PDFs into individual pages or extract custom page ranges.', path: '/split', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: Minimize2, title: 'Compress PDF', desc: 'Reduce file size by stripping metadata and rebuilding structure.', path: '/compress', color: 'bg-tool-emerald/15 text-tool-emerald' },
      { icon: Palette, title: 'Grayscale PDF', desc: 'Convert color PDFs to grayscale to reduce file size further.', path: '/grayscale', color: 'bg-tool-cyan/15 text-tool-cyan' },
      { icon: RotateCw, title: 'Rotate Pages', desc: 'Rotate PDF pages by 90°, 180°, or 270° with a single click.', path: '/rotate', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: Trash2, title: 'Delete Pages', desc: 'Remove specific pages from any PDF document.', path: '/delete-pages', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: FileOutput, title: 'Extract Pages', desc: 'Pull specific pages from any PDF into a new document.', path: '/extract-pages', color: 'bg-tool-pink/15 text-tool-pink' },
      { icon: Droplets, title: 'Add Watermark', desc: 'Stamp text watermarks on every page of your PDF.', path: '/add-watermark', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: Lock, title: 'Encrypt PDF', desc: 'Add password protection to your PDF files.', path: '/encrypt', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: Unlock, title: 'Unlock PDF', desc: 'Remove print/copy/edit restrictions from PDFs.', path: '/unlock-pdf', color: 'bg-tool-rose/15 text-tool-rose' },
      { icon: Hash, title: 'Page Numbers', desc: 'Add sequential page numbers to every page of your PDF.', path: '/page-numbers', color: 'bg-tool-amber/15 text-tool-amber' },
      { icon: Layers, title: 'Flatten PDF', desc: 'Remove form fields, annotations, and layers from PDFs.', path: '/flatten', color: 'bg-tool-teal/15 text-tool-teal' },
      { icon: Layers, title: 'Reorder Pages', desc: 'Drag and drop to rearrange pages in your PDF.', path: '/reorder-pages', color: 'bg-tool-violet/15 text-tool-violet' },
    ],
  },
  {
    label: 'Converters',
    tools: [
      { icon: ArrowRightLeft, title: 'Convert Files', desc: 'Convert between PDF, images, and document formats instantly.', path: '/convert', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: ArrowRightLeft, title: 'PDF to Word', desc: 'Convert PDF documents to editable Word (.docx) files.', path: '/pdf-to-word', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: ArrowRightLeft, title: 'Word to PDF', desc: 'Convert Word documents to PDF format.', path: '/word-to-pdf', color: 'bg-tool-indigo/15 text-tool-indigo' },
      { icon: Code, title: 'XML to PDF/Word', desc: 'Parse XML files and convert to formatted PDF or Word documents.', path: '/convert', color: 'bg-tool-lime/15 text-tool-lime' },
      { icon: Eraser, title: 'Remove Background', desc: 'AI-powered background removal — 100% in your browser.', path: '/bg-remover', color: 'bg-tool-cyan/15 text-tool-cyan' },
      { icon: Droplets, title: 'Remove Watermark', desc: 'Strip watermarks from PDF files — processed locally.', path: '/watermark-remover', color: 'bg-tool-teal/15 text-tool-teal' },
    ],
  },
  {
    label: 'AI Tools',
    tools: [
      { icon: Brain, title: 'AI Summarizer', desc: 'Upload a PDF and get an AI-generated summary instantly.', path: '/ai-summarize', color: 'bg-tool-violet/15 text-tool-violet' },
      { icon: Languages, title: 'AI Translator', desc: 'Translate PDF documents into any language with AI.', path: '/ai-translate', color: 'bg-tool-emerald/15 text-tool-emerald' },
      { icon: MessageSquare, title: 'AI Q&A', desc: 'Ask questions about your PDF and get AI-powered answers.', path: '/ai-qa', color: 'bg-tool-blue/15 text-tool-blue' },
      { icon: Brain, title: '40+ AI Document Tools', desc: 'Extract, analyze, generate & transform docs with AI.', path: '/ai-document-tools', color: 'bg-tool-pink/15 text-tool-pink' },
      { icon: Layers, title: 'Batch Process', desc: 'Process multiple PDFs at once — batch merge or compress.', path: '/batch', color: 'bg-tool-amber/15 text-tool-amber' },
    ],
  },
];

const steps = [
  { icon: Upload, title: 'Upload', desc: 'Drag & drop or select your files from any device.' },
  { icon: Cpu, title: 'Process', desc: 'Files are processed instantly in your browser — nothing is uploaded.' },
  { icon: Download, title: 'Download', desc: 'Get your result file in seconds. Done!' },
];

const trustItems = [
  { icon: Shield, title: '100% Private', desc: 'Files never leave your browser. Zero server uploads.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Instant processing powered by your device.' },
  { icon: Globe, title: 'Works Offline', desc: 'No internet needed after loading.' },
  { icon: Lock, title: 'No Sign-Up', desc: 'No accounts, no emails, no passwords.' },
  { icon: Layers, title: 'Any File Size', desc: 'Works with PDFs of any page count or size.' },
  { icon: FileText, title: 'Totally Free', desc: 'No subscriptions, no hidden fees, ever.' },
];

const faqs = [
  { q: 'Is MergePDF really free?', a: 'Yes, 100% free with no hidden costs, no subscriptions, and no watermarks. Every feature is available to everyone.' },
  { q: 'Are my files safe?', a: 'Absolutely. All processing happens directly in your browser. Your files are never uploaded to any server — they stay on your device the entire time.' },
  { q: 'Do I need to create an account?', a: 'No. You can use every tool immediately without signing up, logging in, or providing any personal information.' },
  { q: 'What file formats are supported?', a: 'We support PDF, PNG, JPG, WEBP, XML, and more. You can convert between these formats and manipulate PDFs in various ways.' },
  { q: 'Does it work on mobile?', a: 'Yes! MergePDF is fully responsive and works on any device with a modern browser — phones, tablets, and desktops.' },
  { q: 'Can I use it offline?', a: 'Once the page is loaded, most tools work without an internet connection since all processing is done locally.' },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="MergePDF — Free PDF Tools Online | Merge, Split, Compress & Convert"
      description="Free online PDF tools — merge, split, compress, convert, rotate PDFs and remove image backgrounds. 100% private, no uploads, no sign-up required."
      path="/"
    />

    <Header />

    {/* Hero */}
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          100% Free · No Login · No Uploads · Forever Private
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Free PDF Tools<br />
          <span className="text-primary">No Strings Attached</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Merge, split, compress, convert, and edit PDFs — all processed in your browser.
          No uploads, no sign-up, no fees. Ever.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="rounded-xl px-8 text-base font-semibold">
            <Link to="/merge">
              Start Using MergePDF Free
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl px-8 text-base">
            <a href="#tools">Explore All Tools</a>
          </Button>
        </div>
      </motion.div>
    </section>

    {/* Tools Grid */}
    <section id="tools" className="border-t border-border/60 bg-card/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            All the PDF tools you need
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Every tool works instantly in your browser — no file ever touches a server.
          </p>
        </motion.div>
        <div className="mt-12 space-y-12">
          {toolCategories.map((category) => (
            <div key={category.label}>
              <h3 className="font-display text-xl font-bold text-foreground mb-5">{category.label}</h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {category.tools.map((tool, i) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link
                      to={tool.path}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tool.color}`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{tool.title}</h3>
                      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{tool.desc}</p>
                      <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Try now <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
            Three simple steps — your files never leave your device.
          </p>
        </motion.div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="mb-2 font-display text-sm font-semibold text-primary">Step {i + 1}</div>
              <h3 className="font-display text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Trust / Features */}
    <section className="border-t border-border/60 bg-card/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
          Why choose MergePDF?
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent">
                <item.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-3xl font-bold text-foreground md:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
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
    <section className="border-t border-border/60 bg-primary/5 py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Ready to get started?
        </h2>
        <p className="mt-3 text-muted-foreground">
          No sign-up, no fees, no catches. Just powerful PDF tools.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-xl px-8 text-base font-semibold">
          <Link to="/merge">
            Start Now — It's Free
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;

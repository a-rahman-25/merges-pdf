import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  toolPath: string;
  toolName: string;
  content: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

const articles: BlogArticle[] = [
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files Online for Free',
    seoTitle: 'How to Merge PDF Files Online Free — Step-by-Step Guide | MergesPDF',
    description: 'Learn how to combine multiple PDF documents into one file using MergesPDF. No uploads to servers, no sign-up, completely free. Step-by-step guide with tips.',
    date: 'March 2026',
    toolPath: '/merge',
    toolName: 'Merge PDF',
    content: [
      { heading: 'Why Merge PDF Files?', body: 'Combining multiple PDF documents into a single file is one of the most common document tasks. Whether you\'re compiling reports, joining scanned pages, or assembling a portfolio, merging PDFs saves time and keeps your files organized.\n\nUnlike other tools that upload your files to remote servers, MergesPDF processes everything directly in your browser — your documents never leave your device.' },
      { heading: 'Step 1: Open the Merge PDF Tool', body: 'Navigate to mergespdf.com/merge or click the "Merge PDFs" button on the homepage. The tool loads instantly with no sign-up or account required.' },
      { heading: 'Step 2: Add Your PDF Files', body: 'Drag and drop your PDF files onto the upload area, or click to browse and select files from your device. You can add as many PDFs as you need — there are no file limits.\n\nThe tool will show each file with its name, size, and page count so you can verify you\'ve selected the right documents.' },
      { heading: 'Step 3: Reorder Your Files', body: 'Need your PDFs in a specific order? Simply drag and drop the files in the list to rearrange them. The final merged document will follow the order you set.\n\nThis is especially useful when combining chapters of a book, sections of a report, or pages from different sources.' },
      { heading: 'Step 4: Merge and Download', body: 'Click the "Merge PDFs" button. Processing happens instantly in your browser. Once complete, you\'ll see a summary of the merged document including total pages and file size.\n\nReview the summary, then click "Confirm & Download" to save your merged PDF. That\'s it — no watermarks, no quality loss, completely free.' },
      { heading: 'Tips for Better PDF Merging', body: '• **Check page orientation** — Make sure all documents use the same orientation (portrait/landscape) for a consistent result.\n• **Compress first** — If your merged PDF is too large, use our Compress PDF tool afterward.\n• **Verify page count** — The tool shows total pages before download so you can confirm everything is included.\n• **No file size limits** — Unlike other tools, MergesPDF doesn\'t impose artificial size restrictions.' },
    ],
    faqs: [
      { q: 'Is merging PDFs free on MergesPDF?', a: 'Yes, 100% free with no hidden costs, no watermarks, and no file limits. You can merge as many PDFs as you want.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All processing happens directly in your browser. Your files never leave your device, ensuring complete privacy.' },
      { q: 'Can I reorder pages before merging?', a: 'Yes! You can drag and drop files to reorder them before merging. The final PDF will follow your chosen order.' },
      { q: 'Is there a file size limit?', a: 'No artificial limits. The tool works with PDFs of any size, limited only by your device\'s available memory.' },
      { q: 'Do I need to create an account?', a: 'No. You can use the merge tool immediately without signing up, logging in, or providing any personal information.' },
    ],
  },
  {
    slug: 'how-to-compress-pdf',
    title: 'How to Compress PDF Without Losing Quality',
    seoTitle: 'How to Compress PDF Free Without Losing Quality | MergesPDF',
    description: 'Reduce PDF file size without losing quality. Free step-by-step guide to compressing PDFs online using MergesPDF — no uploads, no sign-up required.',
    date: 'March 2026',
    toolPath: '/compress',
    toolName: 'Compress PDF',
    content: [
      { heading: 'Why Compress PDF Files?', body: 'Large PDF files are problematic — they\'re slow to email, difficult to upload, and eat up storage space. Compressing your PDFs reduces file size while maintaining readability and visual quality.\n\nCommon reasons to compress PDFs:\n• Email attachments with size limits (usually 10-25 MB)\n• Faster uploads to websites and portals\n• Reduced storage consumption\n• Quicker file transfers and sharing' },
      { heading: 'Step 1: Open the Compress Tool', body: 'Go to mergespdf.com/compress. The tool is ready to use immediately — no account, no installation, no waiting.' },
      { heading: 'Step 2: Select Your PDF', body: 'Drag and drop your PDF file onto the upload area, or click to browse your files. The tool will display the file name, size, and page count.\n\nThe compression works on any standard PDF file, regardless of how many pages or how large it is.' },
      { heading: 'Step 3: Compress and Review', body: 'Click "Compress PDF" and the tool will process your file instantly in your browser. It works by stripping unnecessary metadata, removing duplicate resources, and rebuilding the document structure.\n\nAfter compression, you\'ll see a detailed summary showing:\n• Original file size\n• Compressed file size\n• Percentage reduction\n\nReview these numbers to confirm the compression meets your needs.' },
      { heading: 'Step 4: Download', body: 'Click "Confirm & Download" to save your compressed PDF. The resulting file maintains the same visual quality while being significantly smaller.' },
      { heading: 'Tips for Maximum Compression', body: '• **Convert to grayscale** — If color isn\'t needed, use our Grayscale tool first for additional size reduction.\n• **Remove unnecessary pages** — Use the Delete Pages tool to remove blank or unwanted pages before compressing.\n• **Compress images separately** — If your PDF contains many high-resolution images, consider converting them to a lower resolution first.\n• **Try multiple times** — Running compression again on an already-compressed PDF may yield additional savings.' },
    ],
    faqs: [
      { q: 'Does compression reduce PDF quality?', a: 'Our compression works by removing unnecessary metadata and optimizing the document structure. The visual content remains the same quality.' },
      { q: 'How much can I reduce the file size?', a: 'Results vary depending on the PDF content. Typical reductions range from 10% to 50%, with metadata-heavy files seeing the largest improvements.' },
      { q: 'Is the compressed PDF still readable?', a: 'Yes. The compression process doesn\'t alter the visible content of your PDF — text, images, and layout remain unchanged.' },
      { q: 'Can I compress multiple PDFs at once?', a: 'Use our Batch Processing tool to compress multiple PDFs simultaneously.' },
    ],
  },
  {
    slug: 'how-to-convert-pdf-to-word',
    title: 'How to Convert PDF to Word for Free',
    seoTitle: 'How to Convert PDF to Word Free Online — Complete Guide | MergesPDF',
    description: 'Convert PDF documents to editable Word files (.docx) for free. Step-by-step guide using MergesPDF — no uploads, no account needed.',
    date: 'March 2026',
    toolPath: '/pdf-to-word',
    toolName: 'PDF to Word',
    content: [
      { heading: 'Why Convert PDF to Word?', body: 'PDF files are great for sharing final documents, but they\'re difficult to edit. Converting a PDF to Word (.docx) format allows you to:\n• Edit text and formatting\n• Copy content easily\n• Reuse document layouts\n• Collaborate with others who use Word\n\nMergesPDF offers a free, privacy-first PDF to Word converter that works entirely in your browser.' },
      { heading: 'Step 1: Open the PDF to Word Tool', body: 'Navigate to mergespdf.com/pdf-to-word. The converter loads instantly and is ready to use — no sign-up, no downloads, no installation.' },
      { heading: 'Step 2: Select Your PDF File', body: 'Click the upload area to browse for your PDF file, or drag and drop it directly. The tool supports any standard PDF file.\n\nOnce selected, you\'ll see the file name and size displayed for confirmation.' },
      { heading: 'Step 3: Convert', body: 'Click "Convert to Word" and the tool will process your PDF. The conversion extracts the document structure and creates a properly formatted .docx file.\n\nAfter conversion, you\'ll see a summary showing the source file, number of pages, output filename, and file size.' },
      { heading: 'Step 4: Review and Download', body: 'Review the conversion summary to verify everything looks correct. Then click "Confirm & Download" to save your Word document.\n\nThe resulting .docx file can be opened in Microsoft Word, Google Docs, LibreOffice, or any other word processor.' },
      { heading: 'Important Notes', body: '• **Browser-based limitation** — Our converter extracts document structure but may not capture all complex formatting. For highly designed PDFs with complex layouts, a desktop tool may provide better results.\n• **Text-based PDFs work best** — PDFs created from digital documents convert better than scanned documents.\n• **Page dimensions preserved** — The converter captures page dimensions to help recreate the layout in Word format.' },
    ],
    faqs: [
      { q: 'Is the PDF to Word converter free?', a: 'Yes, completely free. No hidden fees, no watermarks on output, and no usage limits.' },
      { q: 'Will the formatting be preserved?', a: 'The converter extracts document structure. Simple text-based PDFs convert well. Complex designs with images and special formatting may need manual adjustments.' },
      { q: 'Can I convert scanned PDFs?', a: 'Our browser-based tool works best with digitally-created PDFs. For scanned documents, you may need an OCR tool first.' },
      { q: 'What Word format is used?', a: 'The output is in .docx format, compatible with Microsoft Word 2007 and later, Google Docs, and LibreOffice.' },
    ],
  },
  {
    slug: 'best-free-pdf-tools-online',
    title: 'Best Free PDF Tools Online in 2026',
    seoTitle: 'Best Free PDF Tools Online 2026 — No Sign-Up Required | MergesPDF',
    description: 'Discover the best free PDF tools available online in 2026. Merge, split, compress, convert, and edit PDFs without sign-up or payments.',
    date: 'March 2026',
    toolPath: '/',
    toolName: 'All Tools',
    content: [
      { heading: 'The State of Free PDF Tools', body: 'In 2026, you shouldn\'t have to pay for basic PDF operations. Yet most "free" PDF tools either limit your usage, add watermarks, or require account creation. MergesPDF is different — every tool is genuinely free, with no catches.\n\nHere\'s a roundup of the most useful free PDF tools available right now.' },
      { heading: '1. Merge PDF — Combine Files Instantly', body: 'The merge tool lets you combine multiple PDF documents into a single file. Drag to reorder, then merge with one click. No file limits, no watermarks.\n\n→ Try it: mergespdf.com/merge' },
      { heading: '2. Compress PDF — Reduce File Size', body: 'Shrink large PDFs without losing quality. The compressor strips metadata and optimizes structure, typically reducing file size by 10-50%.\n\n→ Try it: mergespdf.com/compress' },
      { heading: '3. Split PDF — Extract Pages', body: 'Split a PDF into individual pages or extract a custom range. Perfect for pulling chapters from books or specific pages from reports.\n\n→ Try it: mergespdf.com/split' },
      { heading: '4. Convert PDF — Multiple Formats', body: 'Convert between PDF and images (JPG, PNG, WEBP), PDF to Word, Word to PDF, and more. All conversions happen in your browser.\n\n→ Try it: mergespdf.com/convert' },
      { heading: '5. AI-Powered Tools', body: 'MergesPDF also offers AI tools: summarize documents, translate PDFs, and ask questions about your documents. These use streaming AI for real-time responses.\n\n→ Try: mergespdf.com/ai-summarize' },
      { heading: 'Privacy First', body: 'What sets MergesPDF apart is privacy. Most PDF processing happens entirely in your browser — files never touch a server. For AI features, data is processed and immediately deleted. No accounts, no tracking, no data retention.' },
    ],
    faqs: [
      { q: 'Are these tools really free?', a: 'Yes, every tool on MergesPDF is completely free with no usage limits, no watermarks, and no account required.' },
      { q: 'Do I need to install anything?', a: 'No. All tools run directly in your web browser. No downloads or installations needed.' },
      { q: 'Are my files safe?', a: 'Yes. Most processing happens in your browser, meaning files never leave your device. AI features process data securely and delete it immediately.' },
    ],
  },
  {
    slug: 'how-to-split-pdf-files',
    title: 'How to Split Large PDF Files Online',
    seoTitle: 'How to Split PDF Files Online Free — Easy Guide | MergesPDF',
    description: 'Split large PDF files into individual pages or extract specific page ranges. Free step-by-step guide — no uploads, no account needed.',
    date: 'March 2026',
    toolPath: '/split',
    toolName: 'Split PDF',
    content: [
      { heading: 'Why Split PDF Files?', body: 'Splitting PDFs is useful when you need to:\n• Extract specific chapters from a book\n• Send only relevant pages from a large report\n• Separate a multi-page scan into individual documents\n• Reduce file size by removing unnecessary pages' },
      { heading: 'Step 1: Open the Split Tool', body: 'Go to mergespdf.com/split. The tool is free and ready to use instantly — no sign-up required.' },
      { heading: 'Step 2: Upload Your PDF', body: 'Drag and drop your PDF or click to select it. The tool shows the file name, size, and total page count.' },
      { heading: 'Step 3: Choose Split Mode', body: 'You have two options:\n• **All Pages** — Splits the PDF into individual single-page files\n• **Page Range** — Enter specific pages (e.g., "1-3, 5, 8-10") to extract into a new PDF\n\nThe page range mode is perfect when you only need certain pages from a large document.' },
      { heading: 'Step 4: Split and Download', body: 'Click the split button. For "All Pages" mode, each page is available as a separate download. For "Page Range" mode, you\'ll see a review summary before downloading the extracted PDF.' },
    ],
    faqs: [
      { q: 'Can I split a PDF into specific page ranges?', a: 'Yes. Use the Page Range mode and enter pages like "1-3, 5, 8-10" to extract exactly the pages you need.' },
      { q: 'Is there a limit on PDF size?', a: 'No. The tool handles PDFs of any size, limited only by your device\'s memory.' },
      { q: 'Can I split encrypted PDFs?', a: 'The tool attempts to process encrypted PDFs, but some with strict restrictions may not be supported.' },
    ],
  },
];

const BlogArticlePage = ({ article }: { article: BlogArticle }) => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title={article.seoTitle}
      description={article.description}
      path={`/blog/${article.slug}`}
      faqs={article.faqs}
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: '2026-03-10',
        author: { '@type': 'Organization', name: 'MergesPDF', url: 'https://mergespdf.com' },
        publisher: { '@type': 'Organization', name: 'MergesPDF', url: 'https://mergespdf.com' },
      }}
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

    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" /> {article.date}
      </div>

      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{article.description}</p>

      <div className="mt-6">
        <Button asChild size="lg" className="rounded-xl px-6">
          <Link to={article.toolPath}>
            Try {article.toolName} Free <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <article className="mt-12 space-y-8">
        {article.content.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">{section.heading}</h2>
            <div className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
              {section.body.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>
                  : <span key={j}>{part}</span>
              )}
            </div>
          </section>
        ))}
      </article>

      {/* FAQ */}
      {article.faqs.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {article.faqs.map((faq) => (
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
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="font-display text-xl font-bold text-foreground">Ready to try it?</h3>
        <p className="mt-2 text-muted-foreground">Use {article.toolName} free — no sign-up, no limits.</p>
        <Button asChild size="lg" className="mt-6 rounded-xl px-8">
          <Link to={article.toolPath}>
            Open {article.toolName} <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Related articles */}
      <div className="mt-16">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Related Articles</h3>
        <div className="space-y-3">
          {articles.filter(a => a.slug !== article.slug).slice(0, 3).map(a => (
            <Link key={a.slug} to={`/blog/${a.slug}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
              <p className="font-display font-semibold text-foreground">{a.title}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{a.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </motion.main>

    <Footer />
  </div>
);

// Blog index page
const BlogIndex = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="MergesPDF Blog — PDF Tips, Guides & How-To Articles"
      description="Tips, step-by-step guides, and insights about PDF tools, file privacy, and getting the most out of MergesPDF's free online tools."
      path="/blog"
    />
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Combine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MergesPDF</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">About</Link>
          <Link to="/contact" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Contact</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">Step-by-step guides and tips for working with PDF files.</p>

        <div className="mt-12 space-y-6">
          {articles.map((post, i) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={`/blog/${post.slug}`} className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {post.date}
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                  Read article <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </main>

    <Footer />
  </div>
);

// Router component
const Blog = () => {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) {
    const article = articles.find(a => a.slug === slug);
    if (article) return <BlogArticlePage article={article} />;
    // Fallback to index if slug not found
  }

  return <BlogIndex />;
};

export { articles as blogArticles };
export default Blog;

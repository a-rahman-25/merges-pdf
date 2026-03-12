import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Combine, Scissors, Minimize2, ArrowRightLeft, RotateCw, Eraser, FileText, Shield, Zap, Globe, Lock, Layers, Code, Droplets, Trash2, FileOutput, Brain, Languages, MessageSquare, ChevronDown, Palette, Hash, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PrivacyNotice from '@/components/PrivacyNotice';
import Footer from '@/components/Footer';

type TabId = 'merge' | 'split' | 'compress' | 'convert' | 'rotate' | 'bg-remover' | 'watermark-remover' | 'encrypt' | 'delete-pages' | 'extract-pages' | 'add-watermark' | 'pdf-to-word' | 'word-to-pdf' | 'ai-summarize' | 'ai-translate' | 'ai-qa' | 'batch' | 'grayscale' | 'page-numbers' | 'flatten' | 'unlock' | 'image-to-pdf' | 'reorder-pages';

interface TabItem {
  id: TabId;
  label: string;
  icon: typeof Combine;
  path: string;
}

interface TabGroup {
  label: string;
  tabs: TabItem[];
}

const tabGroups: TabGroup[] = [
  {
    label: 'PDF Tools',
    tabs: [
      { id: 'merge', label: 'Merge', icon: Combine, path: '/merge' },
      { id: 'split', label: 'Split', icon: Scissors, path: '/split' },
      { id: 'compress', label: 'Compress', icon: Minimize2, path: '/compress' },
      { id: 'grayscale', label: 'Grayscale', icon: Palette, path: '/grayscale' },
      { id: 'rotate', label: 'Rotate', icon: RotateCw, path: '/rotate' },
      { id: 'delete-pages', label: 'Delete Pages', icon: Trash2, path: '/delete-pages' },
      { id: 'extract-pages', label: 'Extract Pages', icon: FileOutput, path: '/extract-pages' },
      { id: 'page-numbers', label: 'Page Numbers', icon: Hash, path: '/page-numbers' },
      { id: 'add-watermark', label: 'Add Watermark', icon: Droplets, path: '/add-watermark' },
      { id: 'encrypt', label: 'Encrypt', icon: Lock, path: '/encrypt' },
      { id: 'unlock', label: 'Unlock', icon: Unlock, path: '/unlock-pdf' },
      { id: 'flatten', label: 'Flatten', icon: Layers, path: '/flatten' },
    ],
  },
  {
    label: 'Converters',
    tabs: [
      { id: 'convert', label: 'Convert', icon: ArrowRightLeft, path: '/convert' },
      { id: 'pdf-to-word', label: 'PDF → Word', icon: ArrowRightLeft, path: '/pdf-to-word' },
      { id: 'word-to-pdf', label: 'Word → PDF', icon: ArrowRightLeft, path: '/word-to-pdf' },
      { id: 'bg-remover', label: 'BG Remove', icon: Eraser, path: '/bg-remover' },
      { id: 'watermark-remover', label: 'Remove WM', icon: Layers, path: '/watermark-remover' },
    ],
  },
  {
    label: 'AI Tools',
    tabs: [
      { id: 'ai-summarize', label: 'Summarize', icon: Brain, path: '/ai-summarize' },
      { id: 'ai-translate', label: 'Translate', icon: Languages, path: '/ai-translate' },
      { id: 'ai-qa', label: 'Q&A', icon: MessageSquare, path: '/ai-qa' },
      { id: 'batch', label: 'Batch', icon: Layers, path: '/batch' },
    ],
  },
];

const features = [
  { icon: Combine, title: 'Merge PDFs', desc: 'Combine multiple PDF files into one document. Drag to reorder pages before merging.', color: 'bg-tool-blue/15 text-tool-blue' },
  { icon: Scissors, title: 'Split & Extract', desc: 'Split PDFs into individual pages or extract a custom page range into a new file.', color: 'bg-tool-rose/15 text-tool-rose' },
  { icon: Minimize2, title: 'Compress PDFs', desc: 'Reduce file size by stripping metadata and rebuilding the document structure.', color: 'bg-tool-emerald/15 text-tool-emerald' },
  { icon: ArrowRightLeft, title: 'Convert Files', desc: 'Convert images to PDF, PDF to images, or between PNG, JPG, and WEBP formats.', color: 'bg-tool-violet/15 text-tool-violet' },
  { icon: RotateCw, title: 'Rotate Pages', desc: 'Rotate all pages in a PDF by 90°, 180°, or 270° with a single click.', color: 'bg-tool-amber/15 text-tool-amber' },
  { icon: Code, title: 'XML to PDF/Word', desc: 'Parse XML files and convert them to formatted PDF or Word documents.', color: 'bg-tool-lime/15 text-tool-lime' },
  { icon: Eraser, title: 'Remove Background', desc: 'Remove image backgrounds instantly using AI — 100% in your browser, no uploads.', color: 'bg-tool-cyan/15 text-tool-cyan' },
  { icon: Droplets, title: 'Remove Watermark', desc: 'Strip watermarks from PDF files — processed entirely in your browser.', color: 'bg-tool-teal/15 text-tool-teal' },
  { icon: Lock, title: 'Encrypt PDF', desc: 'Add password protection to your PDF files — processed in your browser.', color: 'bg-tool-indigo/15 text-tool-indigo' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Instant processing powered by your device. No server queues, no waiting.', color: 'bg-tool-amber/15 text-tool-amber' },
  { icon: Globe, title: 'Works Offline', desc: 'No internet needed after loading. Process files anywhere, anytime.', color: 'bg-tool-cyan/15 text-tool-cyan' },
  { icon: Lock, title: 'No Sign-Up', desc: 'Use every feature instantly — no accounts, no emails, no passwords required.', color: 'bg-tool-indigo/15 text-tool-indigo' },
  { icon: Layers, title: 'Any PDF Size', desc: 'Works with any standard PDF file regardless of page count or file size.', color: 'bg-tool-violet/15 text-tool-violet' },
  { icon: FileText, title: 'Totally Free', desc: 'No subscriptions, no hidden fees, no watermarks — not a single cent, ever.', color: 'bg-tool-pink/15 text-tool-pink' },
];

const findActiveGroup = (activeTab: TabId): string => {
  for (const group of tabGroups) {
    if (group.tabs.some(t => t.id === activeTab)) return group.label;
  }
  return tabGroups[0].label;
};

interface ToolPageLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
}

const ToolPageLayout = ({ children, activeTab }: ToolPageLayoutProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const activeGroup = findActiveGroup(activeTab);

  const toggleGroup = (label: string) => {
    setOpenGroup(prev => prev === label ? null : label);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        {/* Grouped Navigation */}
        <div className="mb-10 space-y-2">
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl border border-border bg-card p-1 gap-1">
              {tabGroups.map((group) => {
                const isGroupActive = activeGroup === group.label;
                const isOpen = openGroup === group.label;
                return (
                  <button
                    key={group.label}
                    onClick={() => toggleGroup(group.label)}
                    className={`
                      flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-display font-semibold transition-all
                      ${isGroupActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    {group.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {openGroup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex justify-center pt-1">
                  <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-xl border border-border bg-card/80 p-2">
                    {tabGroups
                      .find(g => g.label === openGroup)
                      ?.tabs.map((tab) => (
                        <Link
                          key={tab.id}
                          to={tab.path}
                          onClick={() => setOpenGroup(null)}
                          className={`
                            flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-display font-medium transition-all whitespace-nowrap
                            ${activeTab === tab.id
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }
                          `}
                        >
                          <tab.icon className="h-4 w-4" />
                          {tab.label}
                        </Link>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {children}

        {/* Privacy Notice */}
        <PrivacyNotice />

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 space-y-10"
        >
          <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Everything you need for PDFs
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div key={feat.title} className="rounded-xl border border-border bg-card p-5">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${feat.color}`}>
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{feat.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolPageLayout;
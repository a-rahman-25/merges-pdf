import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Combine, Scissors, Minimize2, ArrowRightLeft, RotateCw, Eraser, FileText, Shield, Zap, Globe, Lock, Layers, Code, Droplets, Trash2, FileOutput, Brain, Languages, MessageSquare, ChevronDown, Palette, Hash, Unlock, ImageIcon, FormInput, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PrivacyNotice from '@/components/PrivacyNotice';
import Footer from '@/components/Footer';
import { useI18n } from '@/hooks/useI18n';

type TabId = 'merge' | 'split' | 'compress' | 'convert' | 'rotate' | 'bg-remover' | 'watermark-remover' | 'encrypt' | 'delete-pages' | 'extract-pages' | 'add-watermark' | 'pdf-to-word' | 'word-to-pdf' | 'ai-summarize' | 'ai-translate' | 'ai-qa' | 'batch' | 'grayscale' | 'page-numbers' | 'flatten' | 'unlock' | 'image-to-pdf' | 'reorder-pages' | 'pdf-signature' | 'crop-pages' | 'pdf-metadata' | 'merge-images' | 'pdf-to-images' | 'form-filler' | 'redact' | 'repair-pdf' | 'pdf-bookmarks' | 'page-size' | 'epub-to-pdf' | 'html-to-pdf' | 'pdf-a' | 'scan-to-pdf' | 'pdf-overlay';

interface TabItem {
  id: TabId;
  labelKey: string;
  icon: typeof Combine;
  path: string;
}

interface TabGroup {
  labelKey: string;
  tabs: TabItem[];
}

const tabGroups: TabGroup[] = [
  {
    labelKey: 'cat.pdftools',
    tabs: [
      { id: 'merge', labelKey: 'tool.merge', icon: Combine, path: '/merge' },
      { id: 'split', labelKey: 'tool.split', icon: Scissors, path: '/split' },
      { id: 'compress', labelKey: 'tool.compress', icon: Minimize2, path: '/compress' },
      { id: 'grayscale', labelKey: 'tool.grayscale', icon: Palette, path: '/grayscale' },
      { id: 'rotate', labelKey: 'tool.rotate', icon: RotateCw, path: '/rotate' },
      { id: 'delete-pages', labelKey: 'tool.deletePages', icon: Trash2, path: '/delete-pages' },
      { id: 'extract-pages', labelKey: 'tool.extractPages', icon: FileOutput, path: '/extract-pages' },
      { id: 'page-numbers', labelKey: 'tool.pageNumbers', icon: Hash, path: '/page-numbers' },
      { id: 'add-watermark', labelKey: 'tool.watermark', icon: Droplets, path: '/add-watermark' },
      { id: 'encrypt', labelKey: 'tool.encrypt', icon: Lock, path: '/encrypt' },
      { id: 'unlock', labelKey: 'tool.unlock', icon: Unlock, path: '/unlock-pdf' },
      { id: 'flatten', labelKey: 'tool.flatten', icon: Layers, path: '/flatten' },
      { id: 'reorder-pages', labelKey: 'tool.reorder', icon: Layers, path: '/reorder-pages' },
      { id: 'pdf-signature', labelKey: 'tool.sign', icon: Layers, path: '/pdf-signature' },
      { id: 'crop-pages', labelKey: 'tool.crop', icon: Layers, path: '/crop-pages' },
      { id: 'pdf-metadata', labelKey: 'tool.metadata', icon: Layers, path: '/pdf-metadata' },
      { id: 'pdf-to-images', labelKey: 'tool.pdfToImages', icon: ImageIcon, path: '/pdf-to-images' },
      { id: 'form-filler', labelKey: 'tool.formFiller', icon: FormInput, path: '/pdf-form-filler' },
      { id: 'redact', labelKey: 'tool.redact', icon: EyeOff, path: '/pdf-redact' },
    ],
  },
  {
    labelKey: 'cat.converters',
    tabs: [
      { id: 'convert', labelKey: 'tool.convert', icon: ArrowRightLeft, path: '/convert' },
      { id: 'pdf-to-word', labelKey: 'tool.pdfToWord', icon: ArrowRightLeft, path: '/pdf-to-word' },
      { id: 'word-to-pdf', labelKey: 'tool.wordToPdf', icon: ArrowRightLeft, path: '/word-to-pdf' },
      { id: 'bg-remover', labelKey: 'tool.bgRemove', icon: Eraser, path: '/bg-remover' },
      { id: 'watermark-remover', labelKey: 'tool.wmRemove', icon: Layers, path: '/watermark-remover' },
      { id: 'image-to-pdf', labelKey: 'tool.imageToPdf', icon: ArrowRightLeft, path: '/image-to-pdf' },
      { id: 'merge-images', labelKey: 'tool.mergeImages', icon: Combine, path: '/merge-images' },
    ],
  },
  {
    labelKey: 'cat.aitools',
    tabs: [
      { id: 'ai-summarize', labelKey: 'tool.aiSummarize', icon: Brain, path: '/ai-summarize' },
      { id: 'ai-translate', labelKey: 'tool.aiTranslate', icon: Languages, path: '/ai-translate' },
      { id: 'ai-qa', labelKey: 'tool.aiQa', icon: MessageSquare, path: '/ai-qa' },
      { id: 'batch', labelKey: 'tool.batch', icon: Layers, path: '/batch' },
    ],
  },
];

const features = [
  { icon: Combine, titleKey: 'feat.merge', descKey: 'feat.merge.desc', color: 'bg-tool-blue/15 text-tool-blue' },
  { icon: Scissors, titleKey: 'feat.split', descKey: 'feat.split.desc', color: 'bg-tool-rose/15 text-tool-rose' },
  { icon: Minimize2, titleKey: 'feat.compress', descKey: 'feat.compress.desc', color: 'bg-tool-emerald/15 text-tool-emerald' },
  { icon: ArrowRightLeft, titleKey: 'feat.convert', descKey: 'feat.convert.desc', color: 'bg-tool-violet/15 text-tool-violet' },
  { icon: RotateCw, titleKey: 'feat.rotate', descKey: 'feat.rotate.desc', color: 'bg-tool-amber/15 text-tool-amber' },
  { icon: Code, titleKey: 'feat.xml', descKey: 'feat.xml.desc', color: 'bg-tool-lime/15 text-tool-lime' },
  { icon: Eraser, titleKey: 'feat.bgRemove', descKey: 'feat.bgRemove.desc', color: 'bg-tool-cyan/15 text-tool-cyan' },
  { icon: Droplets, titleKey: 'feat.wmRemove', descKey: 'feat.wmRemove.desc', color: 'bg-tool-teal/15 text-tool-teal' },
  { icon: Lock, titleKey: 'feat.encrypt', descKey: 'feat.encrypt.desc', color: 'bg-tool-indigo/15 text-tool-indigo' },
  { icon: Zap, titleKey: 'feat.fast', descKey: 'feat.fast.desc', color: 'bg-tool-amber/15 text-tool-amber' },
  { icon: Globe, titleKey: 'feat.offline', descKey: 'feat.offline.desc', color: 'bg-tool-cyan/15 text-tool-cyan' },
  { icon: Lock, titleKey: 'feat.noSignup', descKey: 'feat.noSignup.desc', color: 'bg-tool-indigo/15 text-tool-indigo' },
  { icon: Layers, titleKey: 'feat.anySize', descKey: 'feat.anySize.desc', color: 'bg-tool-violet/15 text-tool-violet' },
  { icon: FileText, titleKey: 'feat.free', descKey: 'feat.free.desc', color: 'bg-tool-pink/15 text-tool-pink' },
];

const findActiveGroup = (activeTab: TabId): string => {
  for (const group of tabGroups) {
    if (group.tabs.some(t => t.id === activeTab)) return group.labelKey;
  }
  return tabGroups[0].labelKey;
};

interface ToolPageLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
}

const ToolPageLayout = ({ children, activeTab }: ToolPageLayoutProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const activeGroup = findActiveGroup(activeTab);
  const { t } = useI18n();

  const toggleGroup = (labelKey: string) => {
    setOpenGroup(prev => prev === labelKey ? null : labelKey);
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
                const isGroupActive = activeGroup === group.labelKey;
                const isOpen = openGroup === group.labelKey;
                return (
                  <button
                    key={group.labelKey}
                    onClick={() => toggleGroup(group.labelKey)}
                    className={`
                      flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-display font-semibold transition-all
                      ${isGroupActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    {t(group.labelKey)}
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
                      .find(g => g.labelKey === openGroup)
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
                          {t(tab.labelKey)}
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
            {t('layout.allTools')}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div key={feat.titleKey} className="rounded-xl border border-border bg-card p-5">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${feat.color}`}>
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{t(feat.titleKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(feat.descKey)}</p>
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
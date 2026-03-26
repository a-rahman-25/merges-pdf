import Header from '@/components/Header';
import PrivacyNotice from '@/components/PrivacyNotice';
import Footer from '@/components/Footer';
import ToolSidebar from '@/components/ToolSidebar';
import AdUnit from '@/components/AdUnit';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useI18n } from '@/hooks/useI18n';
import {
  Combine, Scissors, Minimize2, ArrowRightLeft, RotateCw, Eraser,
  Droplets, Lock, Layers, Code, Zap, Globe, FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';

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

interface ToolPageLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const ToolPageLayout = ({ children, activeTab }: ToolPageLayoutProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SidebarProvider>
        <div className="flex w-full min-h-[calc(100vh-57px)]">
          <ToolSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Sidebar trigger — always visible */}
            <div className="flex items-center border-b border-border/40 px-4 py-2">
              <SidebarTrigger />
              <span className="ml-2 text-sm text-muted-foreground md:hidden">Tools</span>
            </div>

            <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-12 md:py-20">
              {children}

              <PrivacyNotice />

              {/* Ad Unit: Below tool, above features grid */}
              <div className="mt-12 flex justify-center">
                <AdUnit format="auto" className="w-full" />
              </div>

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
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ToolPageLayout;

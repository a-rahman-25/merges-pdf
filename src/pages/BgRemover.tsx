import { motion } from 'framer-motion';
import BackgroundRemover from '@/components/BackgroundRemover';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';

const BgRemover = () => (
  <ToolPageLayout activeTab="bg-remover">
    <SEOHead
      title="Remove Image Background Online — Free AI Tool | MergePDF"
      description="Remove image backgrounds instantly using AI. 100% free, private — everything runs in your browser with no uploads."
      path="/bg-remover"
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Remove <span className="text-primary">backgrounds</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          AI-powered background removal — 100% in your browser, no uploads.
        </p>
      </div>
      <BackgroundRemover />
    </motion.div>
  </ToolPageLayout>
);

export default BgRemover;

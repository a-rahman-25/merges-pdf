import { motion } from 'framer-motion';
import MergePdfImagesTool from '@/components/MergePdfImages';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';

const MergePdfImages = () => (
  <ToolPageLayout activeTab="merge-pdf-images">
    <SEOHead
      title="Merge PDF and Images into One PDF — Free Online | MergesPDF"
      description="Combine PDFs and JPG/PNG images into one PDF, rearrange pages by drag and drop. Free and private."
      path="/merge-pdf-images"
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Merge PDF <span className="text-primary">& Images</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Combine PDFs and photos into one PDF and arrange the pages any way you like.
        </p>
      </div>
      <MergePdfImagesTool />
    </motion.div>
  </ToolPageLayout>
);

export default MergePdfImages;

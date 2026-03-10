import { motion } from 'framer-motion';
import FileConverter from '@/components/FileConverter';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';

const Convert = () => (
  <ToolPageLayout activeTab="convert">
    <SEOHead
      title="Convert Files — Images to PDF, PDF to Images Free | MergePDF"
      description="Convert images to PDF, PDF to images, or between PNG, JPG, WEBP. Also convert XML to PDF/Word. Free and private."
      path="/convert"
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Convert <span className="text-primary">files</span> easily
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Images to PDF, PDF to images, image formats, and XML — all in your browser.
        </p>
      </div>
      <FileConverter />
    </motion.div>
  </ToolPageLayout>
);

export default Convert;

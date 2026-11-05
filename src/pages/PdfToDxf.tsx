import { motion } from 'framer-motion';
import PDFToDXF from '@/components/PDFToDXF';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';

const PdfToDxf = () => (
  <ToolPageLayout activeTab="pdf-to-dxf">
    <SEOHead
      title="PDF to DXF (AutoCAD) Converter — Free Online | MergesPDF"
      description="Convert PDF drawings to DXF files for AutoCAD. Free, private and processed in your browser."
      path="/pdf-to-dxf"
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          PDF to <span className="text-primary">DXF</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Turn PDF drawings into editable CAD files for AutoCAD.
        </p>
      </div>
      <PDFToDXF />
    </motion.div>
  </ToolPageLayout>
);

export default PdfToDxf;

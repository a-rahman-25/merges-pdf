import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import usePageTracking from "./hooks/usePageTracking";
import NotFound from "./pages/NotFound";

const Merge = lazy(() => import("./pages/Merge"));
const Split = lazy(() => import("./pages/Split"));
const Compress = lazy(() => import("./pages/Compress"));
const Convert = lazy(() => import("./pages/Convert"));
const Rotate = lazy(() => import("./pages/Rotate"));
const BgRemover = lazy(() => import("./pages/BgRemover"));
const WatermarkRemover = lazy(() => import("./pages/WatermarkRemover"));
const Encrypt = lazy(() => import("./pages/Encrypt"));
const DeletePages = lazy(() => import("./pages/DeletePages"));
const ExtractPages = lazy(() => import("./pages/ExtractPages"));
const AddWatermark = lazy(() => import("./pages/AddWatermark"));
const PdfToWord = lazy(() => import("./pages/PdfToWord"));
const WordToPdf = lazy(() => import("./pages/WordToPdf"));
const AiSummarize = lazy(() => import("./pages/AiSummarize"));
const AiTranslate = lazy(() => import("./pages/AiTranslate"));
const AiQa = lazy(() => import("./pages/AiQa"));
const Batch = lazy(() => import("./pages/Batch"));
const Grayscale = lazy(() => import("./pages/Grayscale"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  usePageTracking();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/split" element={<Split />} />
        <Route path="/compress" element={<Compress />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/rotate" element={<Rotate />} />
        <Route path="/bg-remover" element={<BgRemover />} />
        <Route path="/watermark-remover" element={<WatermarkRemover />} />
        <Route path="/encrypt" element={<Encrypt />} />
        <Route path="/delete-pages" element={<DeletePages />} />
        <Route path="/extract-pages" element={<ExtractPages />} />
        <Route path="/add-watermark" element={<AddWatermark />} />
        <Route path="/pdf-to-word" element={<PdfToWord />} />
        <Route path="/word-to-pdf" element={<WordToPdf />} />
        <Route path="/ai-summarize" element={<AiSummarize />} />
        <Route path="/ai-translate" element={<AiTranslate />} />
        <Route path="/ai-qa" element={<AiQa />} />
        <Route path="/batch" element={<Batch />} />
        <Route path="/grayscale" element={<Grayscale />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

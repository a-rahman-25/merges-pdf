import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
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
const PageNumbers = lazy(() => import("./pages/PageNumbers"));
const Flatten = lazy(() => import("./pages/Flatten"));
const UnlockPdf = lazy(() => import("./pages/UnlockPdf"));
const SEOLandingRouter = lazy(() => import("./pages/SEOLandingRouter"));
const AIDocumentTools = lazy(() => import("./pages/AIDocumentTools"));
const AIToolPage = lazy(() => import("./pages/AIToolPage"));

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
    <AnimatePresence>
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
        <Route path="/page-numbers" element={<PageNumbers />} />
        <Route path="/flatten" element={<Flatten />} />
        <Route path="/unlock-pdf" element={<UnlockPdf />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/tools/:slug" element={<SEOLandingRouter />} />
        <Route path="/ai-document-tools" element={<AIDocumentTools />} />
        <Route path="/ai-document-map" element={<AIToolPage />} />
        <Route path="/ai-document-timeline" element={<AIToolPage />} />
        <Route path="/ai-keyword-extractor" element={<AIToolPage />} />
        <Route path="/ai-idea-generator-from-document" element={<AIToolPage />} />
        <Route path="/ai-report-generator" element={<AIToolPage />} />
        <Route path="/ai-policy-generator" element={<AIToolPage />} />
        <Route path="/ai-presentation-generator" element={<AIToolPage />} />
        <Route path="/compare-documents-ai" element={<AIToolPage />} />
        <Route path="/ai-fact-check-document" element={<AIToolPage />} />
        <Route path="/ai-generate-questions-from-document" element={<AIToolPage />} />
        <Route path="/ai-knowledge-extractor" element={<AIToolPage />} />
        <Route path="/ai-task-extractor" element={<AIToolPage />} />
        <Route path="/ai-email-from-document" element={<AIToolPage />} />
        <Route path="/ai-document-tagger" element={<AIToolPage />} />
        <Route path="/ai-document-rewriter" element={<AIToolPage />} />
        <Route path="/ai-expand-text" element={<AIToolPage />} />
        <Route path="/ai-multi-level-summary" element={<AIToolPage />} />
        <Route path="/ai-action-items" element={<AIToolPage />} />
        <Route path="/ai-knowledge-graph" element={<AIToolPage />} />
        <Route path="/ai-entity-extractor" element={<AIToolPage />} />
        <Route path="/ai-risk-detector" element={<AIToolPage />} />
        <Route path="/ai-compliance-check" element={<AIToolPage />} />
        <Route path="/ai-duplicate-detector" element={<AIToolPage />} />
        <Route path="/ai-writing-analyzer" element={<AIToolPage />} />
        <Route path="/ai-document-classifier" element={<AIToolPage />} />
        <Route path="/ai-title-generator" element={<AIToolPage />} />
        <Route path="/ai-summary-slides" element={<AIToolPage />} />
        <Route path="/ai-data-insights" element={<AIToolPage />} />
        <Route path="/ai-outline-generator" element={<AIToolPage />} />
        <Route path="/ai-tone-converter" element={<AIToolPage />} />
        <Route path="/ai-document-qa" element={<AIToolPage />} />
        <Route path="/ai-key-takeaways" element={<AIToolPage />} />
        <Route path="/ai-learning-notes" element={<AIToolPage />} />
        <Route path="/ai-flashcard-generator" element={<AIToolPage />} />
        <Route path="/ai-concept-explainer" element={<AIToolPage />} />
        <Route path="/ai-abstract-generator" element={<AIToolPage />} />
        <Route path="/ai-headline-generator" element={<AIToolPage />} />
        <Route path="/ai-highlight-important-parts" element={<AIToolPage />} />
        <Route path="/ai-topic-detector" element={<AIToolPage />} />
        <Route path="/ai-document-similarity" element={<AIToolPage />} />
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

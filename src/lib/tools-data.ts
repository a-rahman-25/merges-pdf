import {
  Combine, Scissors, Minimize2, ArrowRightLeft, RotateCw, Eraser,
  Lock, Layers, FileText, Brain, Languages, Droplets, Trash2, FileOutput,
  Hash, Unlock, Palette, MessageSquare, PenTool, ScanLine, Type, ImageIcon, FormInput, EyeOff,
  FileSpreadsheet, Presentation, Image, Wrench, BookOpen, Maximize2,
  BookMarked, Camera, GitCompare, FileCode, Code, Globe, Shield,
  TableProperties, FolderSearch, Braces, SpellCheck, Wand2, Highlighter, Receipt,
  type LucideIcon,
} from 'lucide-react';

export interface ToolItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  path: string;
  color: string;
  category: 'pdftools' | 'converters' | 'aitools';
}

export const allTools: ToolItem[] = [
  // PDF Tools
  { icon: Combine, titleKey: 'tool.merge', descKey: 'tool.merge.desc', path: '/merge', color: 'bg-tool-blue/15 text-tool-blue', category: 'pdftools' },
  { icon: Scissors, titleKey: 'tool.split', descKey: 'tool.split.desc', path: '/split', color: 'bg-tool-rose/15 text-tool-rose', category: 'pdftools' },
  { icon: Minimize2, titleKey: 'tool.compress', descKey: 'tool.compress.desc', path: '/compress', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'pdftools' },
  { icon: Palette, titleKey: 'tool.grayscale', descKey: 'tool.grayscale.desc', path: '/grayscale', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'pdftools' },
  { icon: RotateCw, titleKey: 'tool.rotate', descKey: 'tool.rotate.desc', path: '/rotate', color: 'bg-tool-amber/15 text-tool-amber', category: 'pdftools' },
  { icon: Trash2, titleKey: 'tool.deletePages', descKey: 'tool.deletePages.desc', path: '/delete-pages', color: 'bg-tool-rose/15 text-tool-rose', category: 'pdftools' },
  { icon: FileOutput, titleKey: 'tool.extractPages', descKey: 'tool.extractPages.desc', path: '/extract-pages', color: 'bg-tool-pink/15 text-tool-pink', category: 'pdftools' },
  { icon: Droplets, titleKey: 'tool.watermark', descKey: 'tool.watermark.desc', path: '/add-watermark', color: 'bg-tool-teal/15 text-tool-teal', category: 'pdftools' },
  { icon: Lock, titleKey: 'tool.encrypt', descKey: 'tool.encrypt.desc', path: '/encrypt', color: 'bg-tool-indigo/15 text-tool-indigo', category: 'pdftools' },
  { icon: Unlock, titleKey: 'tool.unlock', descKey: 'tool.unlock.desc', path: '/unlock-pdf', color: 'bg-tool-rose/15 text-tool-rose', category: 'pdftools' },
  { icon: Hash, titleKey: 'tool.pageNumbers', descKey: 'tool.pageNumbers.desc', path: '/page-numbers', color: 'bg-tool-amber/15 text-tool-amber', category: 'pdftools' },
  { icon: Layers, titleKey: 'tool.flatten', descKey: 'tool.flatten.desc', path: '/flatten', color: 'bg-tool-teal/15 text-tool-teal', category: 'pdftools' },
  { icon: Layers, titleKey: 'tool.reorder', descKey: 'tool.reorder.desc', path: '/reorder-pages', color: 'bg-tool-violet/15 text-tool-violet', category: 'pdftools' },
  { icon: PenTool, titleKey: 'tool.sign', descKey: 'tool.sign.desc', path: '/pdf-signature', color: 'bg-tool-indigo/15 text-tool-indigo', category: 'pdftools' },
  { icon: Layers, titleKey: 'tool.crop', descKey: 'tool.crop.desc', path: '/crop-pages', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'pdftools' },
  { icon: FileText, titleKey: 'tool.metadata', descKey: 'tool.metadata.desc', path: '/pdf-metadata', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'pdftools' },
  { icon: ImageIcon, titleKey: 'tool.pdfToImages', descKey: 'tool.pdfToImages.desc', path: '/pdf-to-images', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'pdftools' },
  { icon: FormInput, titleKey: 'tool.formFiller', descKey: 'tool.formFiller.desc', path: '/pdf-form-filler', color: 'bg-tool-violet/15 text-tool-violet', category: 'pdftools' },
  { icon: EyeOff, titleKey: 'tool.redact', descKey: 'tool.redact.desc', path: '/pdf-redact', color: 'bg-tool-rose/15 text-tool-rose', category: 'pdftools' },
  { icon: Wrench, titleKey: 'tool.repair', descKey: 'tool.repair.desc', path: '/repair-pdf', color: 'bg-tool-amber/15 text-tool-amber', category: 'pdftools' },
  { icon: BookOpen, titleKey: 'tool.bookmarks', descKey: 'tool.bookmarks.desc', path: '/pdf-bookmarks', color: 'bg-tool-violet/15 text-tool-violet', category: 'pdftools' },
  { icon: Maximize2, titleKey: 'tool.pageSize', descKey: 'tool.pageSize.desc', path: '/page-size', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'pdftools' },

  // Converters
  { icon: ArrowRightLeft, titleKey: 'tool.convert', descKey: 'tool.convert.desc', path: '/convert', color: 'bg-tool-violet/15 text-tool-violet', category: 'converters' },
  { icon: ArrowRightLeft, titleKey: 'tool.pdfToWord', descKey: 'tool.pdfToWord.desc', path: '/pdf-to-word', color: 'bg-tool-blue/15 text-tool-blue', category: 'converters' },
  { icon: ArrowRightLeft, titleKey: 'tool.wordToPdf', descKey: 'tool.wordToPdf.desc', path: '/word-to-pdf', color: 'bg-tool-indigo/15 text-tool-indigo', category: 'converters' },
  { icon: Eraser, titleKey: 'tool.bgRemove', descKey: 'tool.bgRemove.desc', path: '/bg-remover', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'converters' },
  { icon: Droplets, titleKey: 'tool.wmRemove', descKey: 'tool.wmRemove.desc', path: '/watermark-remover', color: 'bg-tool-teal/15 text-tool-teal', category: 'converters' },
  { icon: ArrowRightLeft, titleKey: 'tool.imageToPdf', descKey: 'tool.imageToPdf.desc', path: '/image-to-pdf', color: 'bg-tool-pink/15 text-tool-pink', category: 'converters' },
  { icon: Combine, titleKey: 'tool.mergeImages', descKey: 'tool.mergeImages.desc', path: '/merge-images', color: 'bg-tool-amber/15 text-tool-amber', category: 'converters' },
  { icon: ArrowRightLeft, titleKey: 'tool.svgToImage', descKey: 'tool.svgToImage.desc', path: '/svg-to-image', color: 'bg-tool-lime/15 text-tool-lime', category: 'converters' },
  { icon: FileSpreadsheet, titleKey: 'tool.excelToPdf', descKey: 'tool.excelToPdf.desc', path: '/excel-to-pdf', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'converters' },
  { icon: FileSpreadsheet, titleKey: 'tool.pdfToExcel', descKey: 'tool.pdfToExcel.desc', path: '/pdf-to-excel', color: 'bg-tool-teal/15 text-tool-teal', category: 'converters' },
  { icon: Presentation, titleKey: 'tool.pptxToPdf', descKey: 'tool.pptxToPdf.desc', path: '/pptx-to-pdf', color: 'bg-tool-blue/15 text-tool-blue', category: 'converters' },
  { icon: Globe, titleKey: 'tool.webpageToPdf', descKey: 'tool.webpageToPdf.desc', path: '/webpage-to-pdf', color: 'bg-tool-indigo/15 text-tool-indigo', category: 'converters' },
  { icon: Image, titleKey: 'tool.heicToPdf', descKey: 'tool.heicToPdf.desc', path: '/heic-to-pdf', color: 'bg-tool-rose/15 text-tool-rose', category: 'converters' },
  { icon: BookMarked, titleKey: 'tool.epubToPdf', descKey: 'tool.epubToPdf.desc', path: '/epub-to-pdf', color: 'bg-tool-violet/15 text-tool-violet', category: 'converters' },
  { icon: Code, titleKey: 'tool.htmlToPdf', descKey: 'tool.htmlToPdf.desc', path: '/html-to-pdf', color: 'bg-tool-lime/15 text-tool-lime', category: 'converters' },
  { icon: Shield, titleKey: 'tool.pdfA', descKey: 'tool.pdfA.desc', path: '/pdf-a', color: 'bg-tool-blue/15 text-tool-blue', category: 'converters' },
  { icon: Camera, titleKey: 'tool.scanToPdf', descKey: 'tool.scanToPdf.desc', path: '/scan-to-pdf', color: 'bg-tool-amber/15 text-tool-amber', category: 'converters' },
  { icon: Layers, titleKey: 'tool.pdfOverlay', descKey: 'tool.pdfOverlay.desc', path: '/pdf-overlay', color: 'bg-tool-indigo/15 text-tool-indigo', category: 'converters' },
  { icon: GitCompare, titleKey: 'tool.comparePdf', descKey: 'tool.comparePdf.desc', path: '/compare-pdf', color: 'bg-tool-violet/15 text-tool-violet', category: 'converters' },
  { icon: Presentation, titleKey: 'tool.pdfToPpt', descKey: 'tool.pdfToPpt.desc', path: '/pdf-to-powerpoint', color: 'bg-tool-blue/15 text-tool-blue', category: 'converters' },
  { icon: FileCode, titleKey: 'tool.markdownToPdf', descKey: 'tool.markdownToPdf.desc', path: '/markdown-to-pdf', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'converters' },
  { icon: Code, titleKey: 'tool.pdfToHtml', descKey: 'tool.pdfToHtml.desc', path: '/pdf-to-html', color: 'bg-tool-lime/15 text-tool-lime', category: 'converters' },
  { icon: FileCode, titleKey: 'tool.pdfToMarkdown', descKey: 'tool.pdfToMarkdown.desc', path: '/pdf-to-markdown', color: 'bg-tool-teal/15 text-tool-teal', category: 'converters' },
  { icon: Braces, titleKey: 'tool.pdfToJson', descKey: 'tool.pdfToJson.desc', path: '/pdf-to-json', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'converters' },

  // AI Tools
  { icon: Brain, titleKey: 'tool.aiSummarize', descKey: 'tool.aiSummarize.desc', path: '/ai-summarize', color: 'bg-tool-violet/15 text-tool-violet', category: 'aitools' },
  { icon: Languages, titleKey: 'tool.aiTranslate', descKey: 'tool.aiTranslate.desc', path: '/ai-translate', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'aitools' },
  { icon: MessageSquare, titleKey: 'tool.aiQa', descKey: 'tool.aiQa.desc', path: '/ai-qa', color: 'bg-tool-blue/15 text-tool-blue', category: 'aitools' },
  { icon: Brain, titleKey: 'tool.aiTools', descKey: 'tool.aiTools.desc', path: '/ai-document-tools', color: 'bg-tool-pink/15 text-tool-pink', category: 'aitools' },
  { icon: Layers, titleKey: 'tool.batch', descKey: 'tool.batch.desc', path: '/batch', color: 'bg-tool-amber/15 text-tool-amber', category: 'aitools' },
  { icon: ScanLine, titleKey: 'tool.ocr', descKey: 'tool.ocr.desc', path: '/ocr-pdf', color: 'bg-tool-teal/15 text-tool-teal', category: 'aitools' },
  { icon: Type, titleKey: 'tool.editor', descKey: 'tool.editor.desc', path: '/pdf-editor', color: 'bg-tool-rose/15 text-tool-rose', category: 'aitools' },
  { icon: TableProperties, titleKey: 'tool.aiTableExtract', descKey: 'tool.aiTableExtract.desc', path: '/ai-table-extract', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'aitools' },
  { icon: FolderSearch, titleKey: 'tool.aiClassify', descKey: 'tool.aiClassify.desc', path: '/ai-classify', color: 'bg-tool-indigo/15 text-tool-indigo', category: 'aitools' },
  { icon: Shield, titleKey: 'tool.aiContractAnalyzer', descKey: 'tool.aiContractAnalyzer.desc', path: '/ai-contract-analyzer', color: 'bg-tool-rose/15 text-tool-rose', category: 'aitools' },
  { icon: SpellCheck, titleKey: 'tool.aiGrammarCheck', descKey: 'tool.aiGrammarCheck.desc', path: '/ai-grammar-check', color: 'bg-tool-cyan/15 text-tool-cyan', category: 'aitools' },
  { icon: FormInput, titleKey: 'tool.aiPdfAutoFill', descKey: 'tool.aiPdfAutoFill.desc', path: '/ai-pdf-autofill', color: 'bg-tool-violet/15 text-tool-violet', category: 'aitools' },
  { icon: Wand2, titleKey: 'tool.aiPdfGenerator', descKey: 'tool.aiPdfGenerator.desc', path: '/ai-pdf-generator', color: 'bg-tool-pink/15 text-tool-pink', category: 'aitools' },
  { icon: MessageSquare, titleKey: 'tool.aiPdfChat', descKey: 'tool.aiPdfChat.desc', path: '/ai-pdf-chat', color: 'bg-tool-blue/15 text-tool-blue', category: 'aitools' },
  { icon: ArrowRightLeft, titleKey: 'tool.aiRewriter', descKey: 'tool.aiRewriter.desc', path: '/ai-rewriter', color: 'bg-tool-violet/15 text-tool-violet', category: 'aitools' },
  { icon: Highlighter, titleKey: 'tool.aiHighlighter', descKey: 'tool.aiHighlighter.desc', path: '/ai-highlighter', color: 'bg-tool-amber/15 text-tool-amber', category: 'aitools' },
  { icon: BookOpen, titleKey: 'tool.aiCitationExtractor', descKey: 'tool.aiCitationExtractor.desc', path: '/ai-citation-extractor', color: 'bg-tool-emerald/15 text-tool-emerald', category: 'aitools' },
  { icon: Receipt, titleKey: 'tool.aiInvoiceParser', descKey: 'tool.aiInvoiceParser.desc', path: '/ai-invoice-parser', color: 'bg-tool-rose/15 text-tool-rose', category: 'aitools' },
];

export const categories = [
  { id: 'all' as const, labelKey: 'cat.all' },
  { id: 'pdftools' as const, labelKey: 'cat.pdftools' },
  { id: 'converters' as const, labelKey: 'cat.converters' },
  { id: 'aitools' as const, labelKey: 'cat.aitools' },
];

// Favorites & Recent tools helpers
const FAVORITES_KEY = 'mergespdf_favorites';
const RECENT_KEY = 'mergespdf_recent';
const MAX_RECENT = 8;

export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
}

export function toggleFavorite(path: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(path) ? favs.filter(f => f !== path) : [...favs, path];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

export function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

export function addRecent(path: string): void {
  const recent = getRecent().filter(r => r !== path);
  recent.unshift(path);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

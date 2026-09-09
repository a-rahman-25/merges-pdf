import * as pdfjsLib from 'pdfjs-dist';

// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

export const DEFAULT_MAX_CHARS = 15000;

export interface PdfTextExtraction {
  text: string;
  /** Pages whose text made it into `text` in full. */
  pagesIncluded: number;
  totalPages: number;
  /** True when the document was longer than the character budget. */
  truncated: boolean;
}

export async function extractPdfTextDetailed(
  file: File,
  maxChars = DEFAULT_MAX_CHARS,
): Promise<PdfTextExtraction> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages && fullText.length < maxChars; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += `\n--- Page ${i} ---\n${pageText}`;
  }

  const text = fullText.slice(0, maxChars);
  // Each page contributes one marker, so surviving markers count whole pages.
  const pagesIncluded = (text.match(/--- Page \d+ ---/g) || []).length;

  return {
    text,
    pagesIncluded,
    totalPages: pdf.numPages,
    truncated: text.length < fullText.length || pagesIncluded < pdf.numPages,
  };
}

export async function extractPdfText(file: File, maxChars = DEFAULT_MAX_CHARS): Promise<string> {
  const { text } = await extractPdfTextDetailed(file, maxChars);
  return text;
}

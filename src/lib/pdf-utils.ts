import { PDFDocument } from 'pdf-lib';

export interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
}

export async function getPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

export async function splitPDF(
  file: File,
  pageIndices?: number[]
): Promise<{ data: Uint8Array; name: string }[]> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, '');
  const results: { data: Uint8Array; name: string }[] = [];
  const indices = pageIndices ?? Array.from({ length: totalPages }, (_, i) => i);

  for (const i of indices) {
    if (i < 0 || i >= totalPages) continue;
    const singlePdf = await PDFDocument.create();
    const [page] = await singlePdf.copyPages(pdf, [i]);
    singlePdf.addPage(page);
    const data = await singlePdf.save();
    results.push({ data, name: `${baseName}_page_${i + 1}.pdf` });
  }

  return results;
}

export async function extractPages(
  file: File,
  pageIndices: number[]
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();
  const validIndices = pageIndices.filter((i) => i >= 0 && i < pdf.getPageCount());
  const pages = await newPdf.copyPages(pdf, validIndices);
  pages.forEach((page) => newPdf.addPage(page));
  return newPdf.save();
}

export async function rotatePDFPages(
  file: File,
  rotation: 0 | 90 | 180 | 270,
  pageIndices?: number[]
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdf.getPages();
  const indices = pageIndices ?? Array.from({ length: pages.length }, (_, i) => i);

  for (const i of indices) {
    if (i >= 0 && i < pages.length) {
      const current = pages[i].getRotation().angle;
      pages[i].setRotation({ type: 'degrees' as any, angle: (current + rotation) % 360 });
    }
  }

  return pdf.save();
}

export async function compressPDF(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const compressedPdf = await PDFDocument.create();
  const pages = await compressedPdf.copyPages(pdf, pdf.getPageIndices());
  pages.forEach((page) => compressedPdf.addPage(page));

  compressedPdf.setTitle('');
  compressedPdf.setAuthor('');
  compressedPdf.setSubject('');
  compressedPdf.setKeywords([]);
  compressedPdf.setProducer('');
  compressedPdf.setCreator('');

  return compressedPdf.save();
}

export async function deletePages(
  file: File,
  pageIndicesToDelete: number[]
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();
  const deleteSet = new Set(pageIndicesToDelete);
  const keepIndices = Array.from({ length: totalPages }, (_, i) => i).filter(
    (i) => !deleteSet.has(i)
  );
  if (keepIndices.length === 0) throw new Error('Cannot delete all pages');
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, keepIndices);
  pages.forEach((page) => newPdf.addPage(page));
  return newPdf.save();
}

export async function addTextWatermark(
  file: File,
  text: string,
  options: { fontSize?: number; opacity?: number; rotation?: number; color?: { r: number; g: number; b: number } } = {}
): Promise<Uint8Array> {
  const { fontSize = 50, opacity = 0.3, rotation = -45, color = { r: 0.5, g: 0.5, b: 0.5 } } = options;
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const radians = (rotation * Math.PI) / 180;
    page.drawText(text, {
      x: width / 2 - (text.length * fontSize * 0.3),
      y: height / 2,
      size: fontSize,
      opacity,
      rotate: { type: 'degrees' as any, angle: rotation },
      color: { type: 'RGB' as any, red: color.r, green: color.g, blue: color.b },
    });
  }

  return pdf.save();
}

export async function reorderPages(
  file: File,
  newOrder: number[]
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();
  const validOrder = newOrder.filter(i => i >= 0 && i < pdf.getPageCount());
  const pages = await newPdf.copyPages(pdf, validOrder);
  pages.forEach(page => newPdf.addPage(page));
  return newPdf.save();
}

export async function addPageNumbers(
  file: File,
  options: { position?: 'bottom' | 'top'; fontSize?: number; startNumber?: number } = {}
): Promise<Uint8Array> {
  const { position = 'bottom', fontSize = 12, startNumber = 1 } = options;
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdf.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const text = `${startNumber + i}`;
    const y = position === 'bottom' ? 20 : height - 30;
    page.drawText(text, {
      x: width / 2 - (text.length * fontSize * 0.25),
      y,
      size: fontSize,
      opacity: 0.7,
    });
  }

  return pdf.save();
}

export async function flattenPDF(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
  pages.forEach(page => newDoc.addPage(page));
  newDoc.setTitle('');
  newDoc.setAuthor('');
  newDoc.setSubject('');
  newDoc.setKeywords([]);
  newDoc.setProducer('MergesPDF');
  newDoc.setCreator('MergesPDF');
  return newDoc.save();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function downloadBlob(data: Uint8Array, filename: string) {
  const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const SUPPORT_EMAIL = 'merge.pdf.st@gmail.com';

import { PDFDocument, degrees } from 'pdf-lib';

export type MergeItem =
  | { kind: 'pdf'; sourceId: string; pageIndex: number; rotation: number }
  | { kind: 'image'; sourceId: string; rotation: number };

export type ImagePageSize = 'fit' | 'a4';

export interface MergeSource {
  bytes: Uint8Array;
  /** 'png' | 'jpg' for images, 'pdf' for PDFs */
  type: 'pdf' | 'png' | 'jpg';
}

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 28;

/** Builds one PDF from pages/images in the given order. */
export async function buildMergedPdf(
  items: MergeItem[],
  sources: Record<string, MergeSource>,
  imageSize: ImagePageSize = 'a4',
): Promise<Uint8Array> {
  if (!items.length) throw new Error('No pages to merge');
  const out = await PDFDocument.create();
  const loaded: Record<string, PDFDocument> = {};

  for (const item of items) {
    const src = sources[item.sourceId];
    if (!src) throw new Error('Missing source file');
    if (item.kind === 'pdf') {
      if (!loaded[item.sourceId]) {
        loaded[item.sourceId] = await PDFDocument.load(src.bytes, { ignoreEncryption: true });
      }
      const [page] = await out.copyPages(loaded[item.sourceId], [item.pageIndex]);
      const base = page.getRotation().angle;
      page.setRotation(degrees((base + item.rotation) % 360));
      out.addPage(page);
    } else {
      const img = src.type === 'png' ? await out.embedPng(src.bytes) : await out.embedJpg(src.bytes);
      let page;
      if (imageSize === 'fit') {
        page = out.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      } else {
        const landscape = img.width > img.height;
        const [pw, ph] = landscape ? [A4[1], A4[0]] : A4;
        page = out.addPage([pw, ph]);
        const scale = Math.min((pw - MARGIN * 2) / img.width, (ph - MARGIN * 2) / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;
        page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      }
      if (item.rotation) page.setRotation(degrees(item.rotation % 360));
    }
  }
  return out.save();
}

/** Moves an element from one index to another, returning a new array. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = list.slice();
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

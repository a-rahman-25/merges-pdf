import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildMergedPdf, moveItem, MergeItem } from '@/lib/merge-pdf-images';

// 1x1 PNG
const PNG = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='), c => c.charCodeAt(0));

async function makePdf(widths: number[]) {
  const d = await PDFDocument.create();
  widths.forEach(w => d.addPage([w, 500]));
  return d.save();
}

describe('buildMergedPdf', () => {
  it('merges a 3-page PDF and an image into 4 pages in chosen order', async () => {
    const pdf = await makePdf([100, 200, 300]);
    const sources = { a: { bytes: pdf, type: 'pdf' as const }, img: { bytes: PNG, type: 'png' as const } };
    const items: MergeItem[] = [
      { kind: 'pdf', sourceId: 'a', pageIndex: 2, rotation: 0 },
      { kind: 'image', sourceId: 'img', rotation: 0 },
      { kind: 'pdf', sourceId: 'a', pageIndex: 0, rotation: 90 },
      { kind: 'pdf', sourceId: 'a', pageIndex: 1, rotation: 0 },
    ];
    const out = await PDFDocument.load(await buildMergedPdf(items, sources, 'fit'));
    const pages = out.getPages();
    expect(pages.length).toBe(4);
    expect(pages[0].getWidth()).toBe(300);
    expect(pages[1].getWidth()).toBe(1);
    expect(pages[2].getWidth()).toBe(100);
    expect(pages[2].getRotation().angle).toBe(90);
    expect(pages[3].getWidth()).toBe(200);
  });

  it('throws when there are no pages', async () => {
    await expect(buildMergedPdf([], {})).rejects.toThrow();
  });
});

describe('moveItem', () => {
  it('moves item from index 0 to 2', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });
});

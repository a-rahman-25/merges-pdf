import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Polyfill for older browsers (needed by recent PDF reader versions)
for (const C of [Map, WeakMap] as any[]) {
  if (!C.prototype.getOrInsertComputed) {
    C.prototype.getOrInsertComputed = function (k: any, f: (k: any) => any) { if (!this.has(k)) this.set(k, f(k)); return this.get(k); };
  }
  if (!C.prototype.getOrInsert) {
    C.prototype.getOrInsert = function (k: any, v: any) { if (!this.has(k)) this.set(k, v); return this.get(k); };
  }
}

type M = [number, number, number, number, number, number];
const mul = (a: M, b: M): M => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
];
const apply = (m: M, x: number, y: number): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

export interface DxfResult { dxf: string; pages: number; lines: number; texts: number; }

const n = (v: number) => (Math.round(v * 1000) / 1000).toString();

/** Convert PDF vector paths + text to an ASCII DXF (R12). Pages are laid out side by side. */
export async function pdfToDxf(file: File, opts: { includeText: boolean }, onProgress?: (p: number) => void): Promise<DxfResult> {
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const OPS = (pdfjsLib as any).OPS;
  const ent: string[] = [];
  let lines = 0, texts = 0, offsetX = 0;

  const line = (layer: string, a: [number, number], b: [number, number]) => {
    if (Math.abs(a[0] - b[0]) < 1e-3 && Math.abs(a[1] - b[1]) < 1e-3) return;
    ent.push('0', 'LINE', '8', layer, '10', n(a[0]), '20', n(a[1]), '30', '0', '11', n(b[0]), '21', n(b[1]), '31', '0');
    lines++;
  };

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const vp = page.getViewport({ scale: 1 });
    const layer = `PAGE_${p}`;
    const base: M = [1, 0, 0, 1, offsetX - (page.view[0] || 0), -(page.view[1] || 0)];
    const ops = await page.getOperatorList();
    let ctm: M = base;
    const stack: M[] = [];

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      const args = ops.argsArray[i];
      if (fn === OPS.save) stack.push(ctm);
      else if (fn === OPS.restore) ctm = stack.pop() || base;
      else if (fn === OPS.transform) ctm = mul(ctm, args as M);
      else if (fn === OPS.constructPath) {
        const drawOp = args[0];
        if (drawOp === OPS.endPath) continue; // clipping only
        const data = args[1]?.[0];
        if (!data || typeof data.length !== 'number') continue;
        let cur: [number, number] | null = null, start: [number, number] | null = null;
        let k = 0;
        while (k < data.length) {
          const op = data[k++];
          if (op === 0) { cur = start = [data[k], data[k + 1]]; k += 2; }
          else if (op === 1) { const nx: [number, number] = [data[k], data[k + 1]]; k += 2; if (cur) line(layer, apply(ctm, ...cur), apply(ctm, ...nx)); cur = nx; }
          else if (op === 2 || op === 3) {
            const cnt = op === 2 ? 6 : 4;
            const c = Array.from(data.slice(k, k + cnt)) as number[]; k += cnt;
            if (cur) {
              const pts = op === 2 ? [cur, [c[0], c[1]], [c[2], c[3]], [c[4], c[5]]] : [cur, [c[0], c[1]], [c[2], c[3]]];
              let prev = cur;
              for (let s = 1; s <= 8; s++) {
                const t = s / 8, u = 1 - t;
                const q: [number, number] = op === 2
                  ? [u*u*u*pts[0][0] + 3*u*u*t*pts[1][0] + 3*u*t*t*pts[2][0] + t*t*t*pts[3][0], u*u*u*pts[0][1] + 3*u*u*t*pts[1][1] + 3*u*t*t*pts[2][1] + t*t*t*pts[3][1]]
                  : [u*u*pts[0][0] + 2*u*t*pts[1][0] + t*t*pts[2][0], u*u*pts[0][1] + 2*u*t*pts[1][1] + t*t*pts[2][1]];
                line(layer, apply(ctm, ...prev), apply(ctm, ...q)); prev = q;
              }
              cur = [c[cnt - 2], c[cnt - 1]];
            }
          } else if (op === 4) { if (cur && start) line(layer, apply(ctm, ...cur), apply(ctm, ...start)); cur = start; }
          else break;
        }
      }
    }

    if (opts.includeText) {
      const tc = await page.getTextContent();
      for (const it of tc.items as any[]) {
        const str = (it.str || '').trim();
        if (!str) continue;
        const [x, y] = apply(base, it.transform[4], it.transform[5]);
        const h = Math.max(1, Math.hypot(it.transform[2], it.transform[3]));
        const rot = (Math.atan2(it.transform[1], it.transform[0]) * 180) / Math.PI;
        const safe = str.replace(/[^\x20-\x7E]/g, '?');
        ent.push('0', 'TEXT', '8', `${layer}_TEXT`, '10', n(x), '20', n(y), '30', '0', '40', n(h), '1', safe, '50', n(rot));
        texts++;
      }
    }
    offsetX += vp.width + 50;
    onProgress?.(p / pdf.numPages);
  }

  const dxf = ['0', 'SECTION', '2', 'HEADER', '9', '$INSUNITS', '70', '0', '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES', ...ent, '0', 'ENDSEC', '0', 'EOF'].join('\n');
  return { dxf, pages: pdf.numPages, lines, texts };
}

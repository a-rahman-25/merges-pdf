#!/usr/bin/env node
// Renders the ground-truthed fixture documents to real PDFs so the AI tools can
// be exercised through the browser exactly as a user would.
//
//   node scripts/ai-audit/make-fixture-pdf.mjs [outDir]

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { report, reportB } from './fixtures.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] || join(here, 'fixture-pdfs');
mkdirSync(outDir, { recursive: true });

async function build({ filename, text }) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = 11;
  const margin = 50;
  const lineHeight = 15;

  // The fixture text uses "--- Page N ---" markers; honour them as page breaks.
  const pages = text.split(/--- Page \d+ ---/).map((p) => p.trim()).filter(Boolean);

  for (const pageText of pages) {
    let page = doc.addPage([595, 842]);
    let y = 842 - margin;
    for (const rawLine of pageText.split('\n')) {
      // Wrap long lines and strip glyphs the standard font cannot encode.
      const line = rawLine.replace(/[^\x20-\x7E]/g, '-');
      const words = line.split(' ');
      let current = '';
      const flush = () => {
        if (y < margin) { page = doc.addPage([595, 842]); y = 842 - margin; }
        page.drawText(current, { x: margin, y, size, font });
        y -= lineHeight;
        current = '';
      };
      for (const w of words) {
        const candidate = current ? `${current} ${w}` : w;
        if (font.widthOfTextAtSize(candidate, size) > 595 - margin * 2) flush();
        current = current ? `${current} ${w}` : w;
      }
      flush();
    }
  }

  const bytes = await doc.save();
  const path = join(outDir, filename);
  writeFileSync(path, bytes);
  console.log(`${path}  (${doc.getPageCount()} pages, ${bytes.length} bytes)`);
}

// Long enough to exceed the 15,000 character extraction budget, so the
// "only the first N pages were analyzed" path can be exercised.
const longReport = {
  filename: 'q3-strategy-review-long.pdf',
  text: Array.from({ length: 14 }, (_, i) =>
    report.text.replace(/--- Page \d+ ---/g, `--- Page ${i + 1} ---`)
      .replace('Q3 STRATEGY REVIEW', `Q3 STRATEGY REVIEW (APPENDIX ${i + 1})`)
  ).join('\n'),
};

await build(report);
await build(reportB);
await build(longReport);

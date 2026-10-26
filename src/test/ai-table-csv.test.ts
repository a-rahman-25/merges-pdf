import { describe, it, expect } from 'vitest';
import { aiTablesToCsv } from '@/lib/ai-table-csv';

// What the table extractor actually streams back: CSV wrapped in markdown.
const modelOutput = `## Table 1: Revenue by region (USD thousands)
\`\`\`csv
Region,Q1,Q2,Q3,Q4
North,1204,1388,1511,1702
South,842,799,915,1038
\`\`\`

## Table 2: Top accounts
| Account | Contract Value | Renewal Date |
|---------|----------------|--------------|
| Northline Logistics | 412,000 | 2026-11-30 |
| **Cedar Health** | 388,500 | 2027-02-14 |
`;

const rows = (csv: string) => csv.split('\n').filter((l) => l.trim() !== '');

describe('aiTablesToCsv', () => {
  it('drops code fences and markdown heading syntax', () => {
    const csv = aiTablesToCsv(modelOutput);
    expect(csv).not.toContain('```');
    expect(csv).not.toMatch(/^#/m);
    expect(csv).not.toContain('**');
  });

  it('keeps table titles as a single quoted cell', () => {
    const csv = aiTablesToCsv(modelOutput);
    expect(csv).toContain('"Table 1: Revenue by region (USD thousands)"');
    expect(csv).toContain('"Table 2: Top accounts"');
  });

  it('converts markdown pipe tables into comma-delimited rows', () => {
    const csv = aiTablesToCsv(modelOutput);
    expect(csv).toContain('Account,Contract Value,Renewal Date');
    expect(csv).toContain('Cedar Health,"388,500",2027-02-14');
    expect(csv).not.toContain('|');
  });

  it('passes plain CSV rows through untouched', () => {
    const csv = aiTablesToCsv(modelOutput);
    expect(csv).toContain('North,1204,1388,1511,1702');
  });

  it('gives every row a consistent, parseable cell count per table', () => {
    const csv = aiTablesToCsv(modelOutput);
    // A quoted field containing a comma must count as one cell.
    const cells = (row: string) => (row.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || []).length - 1;
    const dataRows = rows(csv).filter((r) => cells(r) > 1);
    expect(dataRows.length).toBeGreaterThanOrEqual(6);
    expect(cells('Cedar Health,"388,500",2027-02-14')).toBe(3);
  });

  it('escapes embedded quotes', () => {
    expect(aiTablesToCsv('## He said "hi"')).toBe('"He said ""hi"""');
  });
});

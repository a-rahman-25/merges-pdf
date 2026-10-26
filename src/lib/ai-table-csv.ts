const escapeCell = (value: string) => {
  const clean = value.trim().replace(/\*\*/g, '');
  return /[",\n]/.test(clean) ? `"${clean.replace(/"/g, '""')}"` : clean;
};

/**
 * The table extractor is asked for CSV but the model wraps it in markdown:
 * "## Table 1: ..." headings, fenced blocks, and sometimes pipe tables. Saving
 * that straight to a .csv gives a file no spreadsheet can parse, so normalise
 * it here. Table titles are kept as a single quoted cell rather than dropped.
 */
export function aiTablesToCsv(markdown: string): string {
  return markdown
    .split('\n')
    .filter((line) => !/^\s*```/.test(line))
    .map((line) => {
      const heading = line.match(/^\s*#{1,6}\s*(.+?)\s*$/);
      if (heading) return `"${heading[1].replace(/\*\*/g, '').replace(/"/g, '""')}"`;

      if (/^\s*\|/.test(line)) {
        if (/^\s*\|[\s:|-]+\|\s*$/.test(line)) return '';
        return line
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map(escapeCell)
          .join(',');
      }

      return line.replace(/\*\*/g, '');
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

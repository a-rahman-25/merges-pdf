import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Parse XML file to text content, preserving structure.
 */
function parseXMLToText(xmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid XML file');
  }

  const lines: string[] = [];

  function walk(node: Node, indent: number) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').trim();
      if (text) {
        lines.push('  '.repeat(indent) + text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName;
      const attrs = Array.from(el.attributes)
        .map((a) => `${a.name}="${a.value}"`)
        .join(' ');
      const hasChildren = el.childNodes.length > 0;
      const hasOnlyText =
        el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE;

      if (hasOnlyText) {
        const text = (el.textContent || '').trim();
        lines.push('  '.repeat(indent) + `${tag}${attrs ? ' (' + attrs + ')' : ''}: ${text}`);
      } else if (hasChildren) {
        lines.push('  '.repeat(indent) + `${tag}${attrs ? ' (' + attrs + ')' : ''}:`);
        el.childNodes.forEach((child) => walk(child, indent + 1));
      } else {
        lines.push('  '.repeat(indent) + `${tag}${attrs ? ' (' + attrs + ')' : ''}`);
      }
    }
  }

  walk(doc.documentElement, 0);
  return lines.join('\n');
}

/**
 * Convert XML file to PDF.
 */
export async function xmlToPDF(file: File): Promise<Uint8Array> {
  const xmlString = await file.text();
  const textContent = parseXMLToText(xmlString);

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Courier);
  const fontSize = 10;
  const margin = 50;
  const lineHeight = fontSize * 1.4;

  const lines = textContent.split('\n');
  let page = pdf.addPage();
  let { height } = page.getSize();
  let y = height - margin;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdf.addPage();
      height = page.getSize().height;
      y = height - margin;
    }

    // Filter to only characters the font can encode (Latin + basic symbols)
    // Arabic/non-Latin characters cannot be rendered by pdf-lib's standard fonts
    const safeLine = line.replace(/[^\x00-\x7F]/g, '?');
    const maxChars = 90;
    const displayLine = safeLine.length > maxChars ? safeLine.slice(0, maxChars) + '…' : safeLine;

    page.drawText(displayLine, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= lineHeight;
  }

  return pdf.save();
}

/**
 * Convert XML file to Word (.doc HTML format).
 * Word can open HTML files saved with .doc extension.
 */
export function xmlToWord(file: File): Promise<Blob> {
  return file.text().then((xmlString) => {
    const textContent = parseXMLToText(xmlString);
    const lines = textContent.split('\n');

    // Detect if content has Arabic/RTL characters
    const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(textContent);
    const dir = hasArabic ? 'rtl' : 'ltr';
    const fontFamily = hasArabic
      ? "'Traditional Arabic', 'Arial', 'Courier New', monospace"
      : "'Courier New', monospace";

    const htmlContent = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: ${fontFamily}; font-size: 11pt; line-height: 1.5; margin: 2cm; direction: ${dir}; unicode-bidi: embed; }
    pre { white-space: pre-wrap; word-wrap: break-word; direction: ${dir}; unicode-bidi: embed; }
  </style>
</head>
<body>
<pre>${lines.map((l) => escapeHtml(l)).join('\n')}</pre>
</body>
</html>`;

    return new Blob([htmlContent], {
      type: 'application/msword',
    });
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

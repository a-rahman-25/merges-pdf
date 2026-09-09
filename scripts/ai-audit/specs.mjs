import {
  invoice, contract, meeting, paper, tables, grammarDoc, report, reportB, formPdf,
} from './fixtures.mjs';

// ---------------------------------------------------------------------------
// Structural graders
// ---------------------------------------------------------------------------

const headings = (...names) => (out) => {
  const hit = names.filter((n) => new RegExp(n, 'i').test(out));
  return { score: hit.length / names.length, detail: `${hit.length}/${names.length} required sections` };
};

const countAtLeast = (re, min, label) => (out) => {
  const n = (out.match(re) || []).length;
  return { score: n >= min ? 1 : n / min, detail: `${n} ${label} (need >= ${min})` };
};

const countBetween = (re, min, max, label) => (out) => {
  const n = (out.match(re) || []).length;
  const ok = n >= min && n <= max;
  return {
    score: ok ? 1 : n === 0 ? 0 : Math.max(0, 1 - Math.abs(n < min ? min - n : n - max) / max),
    detail: `${n} ${label} (need ${min}-${max})`,
  };
};

const wordsBetween = (min, max) => (out) => {
  const n = out.trim().split(/\s+/).length;
  const ok = n >= min && n <= max;
  return { score: ok ? 1 : 0.5, detail: `${n} words (need ${min}-${max})` };
};

const parsesAsCsv = () => (out) => {
  const rows = out
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('```'));
  const dataRows = rows.filter((r) => r.split(',').length >= 3);
  const nonCsvNoise = rows.filter((r) => /^#{1,6}\s|^\||^\*\*/.test(r)).length;
  return {
    score: dataRows.length >= 8 ? 1 : dataRows.length / 8,
    detail: `${dataRows.length} comma-delimited rows, ${nonCsvNoise} non-CSV markdown lines`,
  };
};

const nonEmpty = () => (out) => ({
  score: out.trim().length > 200 ? 1 : out.trim().length / 200,
  detail: `${out.trim().length} chars`,
});

// ---------------------------------------------------------------------------
// Dedicated edge functions — each one receives real extracted document text
// (this is what the corresponding React component actually sends).
// ---------------------------------------------------------------------------

export const dedicatedSpecs = [
  {
    id: 'ai-summarize',
    label: 'AI Summarizer',
    fn: 'ai-summarize',
    body: { textContent: report.text, filename: report.filename, pageCount: report.pageCount },
    truth: report.truth,
    structure: nonEmpty(),
    sendsDocumentText: true,
  },
  {
    id: 'ai-qa',
    label: 'AI Q&A',
    fn: 'ai-qa',
    body: {
      textContent: report.text, filename: report.filename, pageCount: report.pageCount,
      question: 'What was Q3 revenue, the gross margin, and the two biggest risks? Quote the numbers.',
      history: [],
    },
    truth: [
      ['revenue 42.7M', /42[.,]7/],
      ['margin 56%', /56\s*%/],
      ['Osaka supplier risk', /Osaka|actuator/i],
      ['lead time risk', /22\s*week|controller/i],
    ],
    structure: nonEmpty(),
    sendsDocumentText: true,
  },
  {
    id: 'ai-pdf-chat',
    label: 'AI PDF Chat',
    fn: 'ai-pdf-chat',
    body: {
      textContent: report.text, filename: report.filename, pageCount: report.pageCount,
      question: 'Which competitor has the largest market share and what is the patent hearing date?',
      history: [],
    },
    truth: [
      ['Kestrel', /Kestrel/i],
      ['31% share', /31\s*%/],
      ['hearing date', /14 January 2027|January 2027/i],
    ],
    structure: nonEmpty(),
    sendsDocumentText: true,
  },
  {
    id: 'ai-translate',
    label: 'AI Translator',
    fn: 'ai-translate',
    body: {
      documentText: report.text, filename: report.filename,
      pageCount: report.pageCount, targetLanguage: 'Arabic',
    },
    truth: [
      ['revenue 42.7 preserved', /42[.,]7/],
      ['388 preserved', /388/],
      ['H-9 preserved', /H-9/i],
      ['Kestrel preserved', /Kestrel/i],
    ],
    structure: (out) => {
      const arabic = (out.match(/[\u0600-\u06FF]/g) || []).length;
      return { score: arabic > 400 ? 1 : arabic / 400, detail: `${arabic} Arabic characters` };
    },
    sendsDocumentText: true,
  },
  {
    id: 'ai-pdf-translator',
    label: 'AI PDF Translator',
    fn: 'ai-pdf-translator',
    body: {
      textContent: report.text, filename: report.filename,
      pageCount: report.pageCount, targetLanguage: 'Spanish',
    },
    truth: [
      ['revenue 42.7 preserved', /42[.,]7/],
      ['388 preserved', /388/],
      ['Almeda preserved', /Almeda/i],
      ['Osaka preserved', /Osaka/i],
      ['22 weeks preserved', /22/],
    ],
    structure: (out) => {
      const spanish = (out.match(/\b(los|las|de|para|riesgo|ingresos|informe|recomendaciones)\b/gi) || []).length;
      return { score: spanish > 15 ? 1 : spanish / 15, detail: `${spanish} Spanish marker words` };
    },
    sendsDocumentText: true,
  },
  {
    id: 'ai-invoice-parser',
    label: 'AI Invoice Parser',
    fn: 'ai-invoice-parser',
    body: { textContent: invoice.text, filename: invoice.filename, pageCount: invoice.pageCount },
    truth: invoice.truth,
    structure: headings('Vendor Information', 'Invoice Details', 'Bill To', 'Line Items', 'Financial Summary', 'Payment Information'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-contract-analyzer',
    label: 'AI Contract Analyzer',
    fn: 'ai-contract-analyzer',
    body: { textContent: contract.text, filename: contract.filename, pageCount: contract.pageCount },
    truth: contract.truth,
    structure: headings('Document Overview', 'Key Risks', 'Key Clauses', 'Financial Terms', 'Important Dates', 'Obligations', 'Recommendations'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-meeting-notes',
    label: 'AI Meeting Notes',
    fn: 'ai-meeting-notes',
    body: { textContent: meeting.text, filename: meeting.filename, pageCount: meeting.pageCount },
    truth: meeting.truth,
    structure: headings('Meeting Overview', 'Action Items', 'Key Decisions', 'Key Discussion Points', 'Important Takeaways', 'Open Questions'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-citation-extractor',
    label: 'AI Citation Extractor',
    fn: 'ai-citation-extractor',
    body: { textContent: paper.text, filename: paper.filename, pageCount: paper.pageCount },
    truth: paper.truth,
    structure: headings('References Found', 'Citation Statistics', 'DOIs', 'In-Text Citations'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-table-extract',
    label: 'AI Table Extractor',
    fn: 'ai-table-extract',
    body: { textContent: tables.text, filename: tables.filename, pageCount: tables.pageCount },
    truth: tables.truth,
    structure: parsesAsCsv(),
    sendsDocumentText: true,
  },
  {
    id: 'ai-classify',
    label: 'AI Classifier',
    fn: 'ai-classify',
    body: {
      documents: [
        { filename: invoice.filename, pageCount: invoice.pageCount, textContent: invoice.text },
        { filename: contract.filename, pageCount: contract.pageCount, textContent: contract.text },
        { filename: paper.filename, pageCount: paper.pageCount, textContent: paper.text },
      ],
    },
    truth: [
      ['classifies invoice', /invoice/i],
      ['classifies contract/agreement', /contract|agreement/i],
      ['classifies academic paper', /academic|research paper|paper/i],
      ['confidence given', /high|medium|low/i],
      ['tags given', /tag/i],
    ],
    structure: countAtLeast(/Document\s*\d|acme-invoice|northline-msa|sparse-retrieval/gi, 3, 'documents labelled'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-highlighter',
    label: 'AI Highlighter',
    fn: 'ai-highlighter',
    body: { textContent: report.text, filename: report.filename, pageCount: report.pageCount },
    truth: report.truth,
    structure: headings('Key Sentences', 'Named Entities', 'People', 'Organizations', 'Locations', 'Important Sections', 'Keywords'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-grammar-check',
    label: 'AI Grammar Checker',
    fn: 'ai-grammar-check',
    body: { textContent: grammarDoc.text, filename: grammarDoc.filename, pageCount: grammarDoc.pageCount },
    truth: grammarDoc.truth,
    structure: headings('Overall Score', 'Grammar & Spelling', 'Style Improvements', 'Readability Analysis', 'Recommendations'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-accessibility-check',
    label: 'AI Accessibility Checker',
    fn: 'ai-accessibility-check',
    body: { textContent: report.text, filename: report.filename, pageCount: report.pageCount },
    truth: [
      ['score out of 100', /\b\d{1,3}\s*\/\s*100|\b\d{1,3}\s*out of 100/i],
      ['heading hierarchy discussed', /heading/i],
      ['reading order discussed', /reading order/i],
      ['issues table', /\|\s*Severity|\| *-+ *\|/i],
      ['recommendations', /recommend/i],
    ],
    structure: headings('Accessibility Score', 'Document Structure', 'Text & Content', 'Tables & Lists', 'Links & Navigation', 'Issues Found', 'Recommendations'),
    sendsDocumentText: true,
  },
  {
    id: 'ai-rewriter',
    label: 'AI Rewriter',
    fn: 'ai-rewriter',
    body: { textContent: report.text, filename: report.filename, pageCount: report.pageCount, tone: 'concise' },
    truth: report.truth,
    structure: (out) => {
      const ratio = out.length / report.text.length;
      return { score: ratio < 1 ? 1 : 0.4, detail: `output/input length ratio ${ratio.toFixed(2)} (concise tone requested)` };
    },
    sendsDocumentText: true,
  },
  {
    id: 'ai-pdf-generator',
    label: 'AI PDF Generator',
    fn: 'ai-pdf-generator',
    body: {
      prompt: 'A one-page equipment rental agreement between Helios Robotics and Almeda Foods for two H-9 picking arms, 6 month term, EUR 4,200 per month, 30 day termination notice, and a liability cap of one month of fees.',
      documentType: 'agreement',
    },
    truth: [
      ['party Helios', /Helios/i],
      ['party Almeda', /Almeda/i],
      ['H-9 equipment', /H-9/i],
      ['6 month term', /six|6\s*month/i],
      ['4200 per month', /4[,.]?200/],
      ['30 day notice', /30|thirty/i],
      ['liability cap', /liab/i],
      ['markdown headings', /^#{1,3}\s/m],
    ],
    structure: nonEmpty(),
    sendsDocumentText: 'n/a — prompt-driven',
  },
  {
    id: 'ai-form-creator',
    label: 'AI Form Creator',
    fn: 'ai-form-creator',
    body: {
      formType: 'vendor onboarding',
      description: 'Collect legal entity name, trade license number, VAT number, contact email and phone, bank IBAN, payment terms dropdown, code of conduct checkbox, incorporation date and annual revenue.',
    },
    truth: [
      ['legal entity field', /legal entity|entity name/i],
      ['trade license field', /trade licen/i],
      ['VAT field', /vat/i],
      ['email field', /email/i],
      ['IBAN field', /iban|bank/i],
      ['payment terms dropdown', /payment terms/i],
      ['code of conduct checkbox', /code of conduct/i],
      ['incorporation date', /incorporat/i],
      ['annual revenue', /revenue/i],
    ],
    structure: (out) => {
      const table = /\|\s*Field Label/i.test(out);
      const block = out.match(/```json\s*([\s\S]*?)```/);
      let jsonOk = false;
      if (block) { try { JSON.parse(block[1]); jsonOk = true; } catch { /* invalid */ } }
      const score = (table ? 0.5 : 0) + (jsonOk ? 0.5 : 0);
      return { score, detail: `field table: ${table}, embedded JSON valid: ${jsonOk}` };
    },
    sendsDocumentText: 'n/a — prompt-driven',
  },
  {
    id: 'ai-pdf-autofill',
    label: 'AI PDF AutoFill',
    fn: 'ai-pdf-autofill',
    json: true,
    body: { formFields: formPdf.fields, contextText: formPdf.context, filename: formPdf.filename },
    truth: formPdf.truth,
    structure: (out) => {
      let parsed;
      try { parsed = JSON.parse(out); } catch { return { score: 0, detail: 'response was not JSON' }; }
      const s = parsed.suggestions;
      if (!Array.isArray(s)) return { score: 0, detail: 'no suggestions array' };
      const named = s.filter((x) => formPdf.fields.some((f) => f.name === x.name)).length;
      const filled = s.filter((x) => x.value && String(x.value).trim() !== '').length;
      const withConf = s.filter((x) => ['high', 'medium', 'low'].includes(x.confidence)).length;
      return {
        score: (named / formPdf.fields.length) * 0.5 + (filled / formPdf.fields.length) * 0.5,
        detail: `${s.length} suggestions, ${named}/${formPdf.fields.length} field names matched, ${filled} non-empty, ${withConf} with valid confidence`,
      };
    },
    sendsDocumentText: true,
  },
];

// ---------------------------------------------------------------------------
// The 40 tools behind the shared `ai-document-tool` function.
// `frontendBody` reproduces byte-for-byte what AIDocumentTool.tsx sends today.
// `controlBody` is the same call with the document text actually included.
// ---------------------------------------------------------------------------

const genericStructure = {
  'ai-flashcard-generator': countBetween(/(?:^|\n)\s*(?:\*\*)?(?:Card\s*\d+|Front\s*[:*])/gi, 15, 20, 'flashcards'),
  'ai-presentation-generator': countBetween(/(?:^|\n)[^\n]*?Slide\s*\d+/gi, 8, 15, 'slides'),
  'ai-summary-slides': countBetween(/(?:^|\n)[^\n]*?Slide\s*\d+/gi, 5, 7, 'slides'),
  'ai-title-generator': countAtLeast(/(?:^|\n)\s*(?:\d{1,2}[.)]|[-*])\s+\S/g, 10, 'titles'),
  'ai-abstract-generator': wordsBetween(150, 400),
  'ai-multi-level-summary': countAtLeast(/🟢|🟡|🔴|brief|medium|detailed/gi, 3, 'summary levels'),
  'ai-concept-explainer': countAtLeast(/🟢|🟡|🔴|simple|intermediate|advanced/gi, 3, 'explanation levels'),
  'ai-tone-converter': countAtLeast(/formal|casual|academic|professional/gi, 4, 'tones'),
  'ai-document-rewriter': countAtLeast(/simplified|professional|engaging/gi, 3, 'styles'),
  'ai-email-from-document': countAtLeast(/subject\s*:/gi, 3, 'email drafts'),
  'ai-generate-questions-from-document': countAtLeast(/(?:^|\n)\s*\d{1,2}[.)]\s+\S/g, 13, 'questions'),
  'ai-key-takeaways': countAtLeast(/(?:^|\n)\s*(?:\d{1,2}[.)]|[-*])\s+\S/g, 5, 'takeaways'),
};

const genericTools = [
  ['ai-document-map', 'AI Document Summary Map'],
  ['ai-document-timeline', 'AI Document Timeline'],
  ['ai-keyword-extractor', 'AI Keyword Extractor'],
  ['ai-idea-generator-from-document', 'AI Idea Generator'],
  ['ai-report-generator', 'AI Report Generator'],
  ['ai-policy-generator', 'AI Policy Generator'],
  ['ai-presentation-generator', 'AI Presentation Generator'],
  ['compare-documents-ai', 'AI Document Comparison', true],
  ['ai-fact-check-document', 'AI Fact Checker'],
  ['ai-generate-questions-from-document', 'AI Question Generator'],
  ['ai-knowledge-extractor', 'AI Knowledge Extractor'],
  ['ai-task-extractor', 'AI Task Extractor'],
  ['ai-email-from-document', 'AI Email Generator'],
  ['ai-document-tagger', 'AI Document Tagger'],
  ['ai-document-rewriter', 'AI Document Rewriter'],
  ['ai-expand-text', 'AI Text Expander'],
  ['ai-multi-level-summary', 'AI Multi-Level Summary'],
  ['ai-action-items', 'AI Action Items'],
  ['ai-knowledge-graph', 'AI Knowledge Graph'],
  ['ai-entity-extractor', 'AI Entity Extractor'],
  ['ai-risk-detector', 'AI Risk Detector'],
  ['ai-compliance-check', 'AI Compliance Check'],
  ['ai-duplicate-detector', 'AI Duplicate Detector'],
  ['ai-writing-analyzer', 'AI Writing Analyzer'],
  ['ai-document-classifier', 'AI Document Classifier'],
  ['ai-title-generator', 'AI Title Generator'],
  ['ai-summary-slides', 'AI Summary Slides'],
  ['ai-data-insights', 'AI Data Insights'],
  ['ai-outline-generator', 'AI Outline Generator'],
  ['ai-tone-converter', 'AI Tone Converter'],
  ['ai-document-qa', 'AI Document Q&A'],
  ['ai-key-takeaways', 'AI Key Takeaways'],
  ['ai-learning-notes', 'AI Learning Notes'],
  ['ai-flashcard-generator', 'AI Flashcard Generator'],
  ['ai-concept-explainer', 'AI Concept Explainer'],
  ['ai-abstract-generator', 'AI Abstract Generator'],
  ['ai-headline-generator', 'AI Headline Generator'],
  ['ai-highlight-important-parts', 'AI Highlight Important Parts'],
  ['ai-topic-detector', 'AI Topic Detector'],
  ['ai-document-similarity', 'AI Document Similarity', true],
];

// Exactly the string AIDocumentTool.tsx builds: name, page count, size. No text.
const fileDescriptor = (f, size) => `PDF Document: "${f.filename}", ${f.pageCount} pages, ${size}.`;

export const genericSpecs = genericTools.map(([slug, label, multi]) => ({
  id: slug,
  label,
  fn: 'ai-document-tool',
  multi: !!multi,
  truth: report.truth,
  structure: genericStructure[slug] || nonEmpty(),
  // Metadata-only payload: name, page count and size, no document content.
  // This is what AIDocumentTool.tsx sent before the extraction fix.
  metadataOnlyBody: {
    toolSlug: slug,
    text: fileDescriptor(report, '248.3 KB'),
    filename: report.filename,
    pageCount: report.pageCount,
    ...(multi ? { filename2: reportB.filename, text2: fileDescriptor(reportB, '176.1 KB') } : {}),
  },
  // The extracted document text, as the component sends it now.
  extractedTextBody: {
    toolSlug: slug,
    text: report.text,
    filename: report.filename,
    pageCount: report.pageCount,
    ...(multi ? { filename2: reportB.filename, text2: reportB.text } : {}),
  },
  sendsDocumentText: false,
}));

export const reportFixture = report;

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AIDocumentTool from '@/components/AIDocumentTool';
import type { AIToolConfig } from '@/lib/ai-tools-config';

const DOC_TEXT =
  '--- Page 1 ---\nQ3 STRATEGY REVIEW — HELIOS ROBOTICS\nRevenue EUR 42.7M, up 23% year over year. ' +
  'Main competitor Kestrel Automation holds 31% share. 68% of actuators come from a single vendor in Osaka.';

const extractPdfText = vi.fn();
const streamAI = vi.fn();

vi.mock('@/lib/pdf-text-extract', () => ({
  extractPdfText: (...args: unknown[]) => extractPdfText(...args),
}));

vi.mock('@/lib/stream-ai', () => ({
  streamAI: (...args: unknown[]) => streamAI(...args),
}));

vi.mock('pdf-lib', () => ({
  PDFDocument: { load: async () => ({ getPageCount: () => 12 }) },
}));

vi.mock('@/hooks/useI18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const tool = {
  slug: 'ai-entity-extractor',
  title: 'AI Entity Extractor',
  shortTitle: 'Entities',
  description: 'Extract entities',
  metaDescription: '',
  icon: () => null,
  color: '',
  systemPrompt: '',
  userPromptTemplate: '',
  category: 'extraction',
  faqs: [],
} as unknown as AIToolConfig;

const pdfFile = (name = 'q3-strategy-review.pdf') => {
  const file = new File(['%PDF-1.7 binary'], name, { type: 'application/pdf' });
  // jsdom does not implement Blob.arrayBuffer, which the component calls.
  Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(8) });
  return file;
};

// The file input is visually hidden, so drive it through a change event.
const upload = (...files: File[]) => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files } });
};

const processButton = () => screen.findByRole('button', { name: /Entities/i });

describe('AIDocumentTool', () => {
  beforeEach(() => {
    extractPdfText.mockReset().mockResolvedValue(DOC_TEXT);
    streamAI.mockReset().mockImplementation(async ({ onDelta, onDone }: any) => {
      onDelta('Organizations: Kestrel Automation. Locations: Osaka.');
      onDone();
    });
  });

  it('sends the extracted document text to the AI function, not just file metadata', async () => {
    render(<AIDocumentTool tool={tool} />);
    upload(pdfFile());

    await waitFor(() => expect(extractPdfText).toHaveBeenCalledTimes(1));
    fireEvent.click(await processButton());

    await waitFor(() => expect(streamAI).toHaveBeenCalledTimes(1));
    const { functionName, body } = streamAI.mock.calls[0][0];

    expect(functionName).toBe('ai-document-tool');
    expect(body.toolSlug).toBe('ai-entity-extractor');
    expect(body.text).toBe(DOC_TEXT);
    expect(body.text).toContain('Kestrel Automation');
    // The old payload was a one-line file descriptor with no document content.
    expect(body.text).not.toMatch(/^PDF Document: "/);
  });

  it('refuses to call the AI when no text could be extracted', async () => {
    extractPdfText.mockResolvedValue('   ');
    render(<AIDocumentTool tool={tool} />);
    upload(pdfFile('scanned.pdf'));

    await waitFor(() => expect(extractPdfText).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: /Entities/i })).not.toBeInTheDocument();
    expect(streamAI).not.toHaveBeenCalled();
  });

  it('sends the text of both documents for comparison tools', async () => {
    const secondText =
      '--- Page 1 ---\nQ2 STRATEGY REVIEW — HELIOS ROBOTICS\nRevenue EUR 34.6M, up 12% year over year. ' +
      'Kestrel Automation leads with 33% share.';
    extractPdfText
      .mockResolvedValueOnce(DOC_TEXT)
      .mockResolvedValueOnce(secondText);

    render(<AIDocumentTool tool={{ ...tool, slug: 'ai-document-similarity', acceptMultiple: true } as AIToolConfig} />);
    upload(pdfFile('q3.pdf'), pdfFile('q2.pdf'));

    await waitFor(() => expect(extractPdfText).toHaveBeenCalledTimes(2));
    fireEvent.click(await processButton());

    await waitFor(() => expect(streamAI).toHaveBeenCalledTimes(1));
    const { body } = streamAI.mock.calls[0][0];
    expect(body.text).toBe(DOC_TEXT);
    expect(body.text2).toBe(secondText);
  });
});

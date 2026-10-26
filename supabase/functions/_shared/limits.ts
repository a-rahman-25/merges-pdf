// These functions are callable by anyone holding the publishable key, which is
// embedded in the shipped bundle, and every call spends AI gateway credits.
// Nothing here authenticates the caller; it only bounds what one call can cost.
//
// The browser sends at most 15,000 characters of document text, so these
// ceilings are invisible to real usage.

export const MAX_DOCUMENT_CHARS = 20_000;
export const MAX_QUESTION_CHARS = 2_000;
export const MAX_PROMPT_CHARS = 4_000;
export const MAX_FILENAME_CHARS = 300;
export const MAX_HISTORY_MESSAGES = 20;
export const MAX_DOCUMENTS = 10;
export const MAX_FORM_FIELDS = 100;

/** Coerces to a string and bounds its length. Non-strings become "". */
export function cap(value: unknown, maxChars: number): string {
  return typeof value === "string" ? value.slice(0, maxChars) : "";
}

/** Bounds an array's length. Non-arrays become []. */
export function capList<T>(value: unknown, maxItems: number): T[] {
  return Array.isArray(value) ? (value.slice(0, maxItems) as T[]) : [];
}

/** Bounds a chat history to recent messages with bounded content. */
export function capHistory(
  value: unknown,
): Array<{ role: string; content: string }> {
  return capList<{ role?: unknown; content?: unknown }>(value, MAX_HISTORY_MESSAGES)
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({ role: String(m.role), content: cap(m.content, MAX_QUESTION_CHARS) }));
}

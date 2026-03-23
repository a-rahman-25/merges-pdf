const HISTORY_KEY = 'mergespdf_processing_history';
const MAX_ITEMS = 20;

export interface HistoryItem {
  id: string;
  toolName: string;
  toolPath: string;
  fileName: string;
  outputName: string;
  timestamp: number;
  fileSize: number;
}

export function getHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
  const history = getHistory();
  history.unshift({
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

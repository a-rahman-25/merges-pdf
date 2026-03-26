import { supabase } from '@/integrations/supabase/client';

// Google Analytics 4 helpers
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Track a virtual page view (for SPA route changes) */
export const trackPageView = (path: string, title?: string) => {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });

  // Also log to Supabase (fire & forget)
  supabase.from('page_views').insert({
    path,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent || null,
  }).then(() => {});
};

/** Track a tool usage event */
export const trackToolUsage = (toolName: string, action: string, details?: Record<string, unknown>) => {
  window.gtag?.('event', 'tool_usage', {
    tool_name: toolName,
    tool_action: action,
    ...details,
  });
};

/** Track a file processing event */
export const trackFileProcess = (toolName: string, fileCount: number, totalSizeMB?: number) => {
  window.gtag?.('event', 'file_process', {
    tool_name: toolName,
    file_count: fileCount,
    total_size_mb: totalSizeMB,
  });
};

/** Log tool usage to Supabase (fire & forget) */
export const logToolUsage = (toolName: string, toolPath: string, fileCount = 1) => {
  supabase.from('tool_usage').insert({
    tool_name: toolName,
    tool_path: toolPath,
    file_count: fileCount,
  }).then(() => {});
};

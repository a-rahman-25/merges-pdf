import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook that intercepts downloads to show a review dialog first.
 * On submit, sends the review via email through the backend.
 */
export function useReviewBeforeDownload(downloadFn: () => void, toolName?: string) {
  const [showReview, setShowReview] = useState(false);

  const triggerDownload = useCallback(() => {
    setShowReview(true);
  }, []);

  const handleSkip = useCallback(() => {
    setShowReview(false);
    downloadFn();
  }, [downloadFn]);

  const handleSubmit = useCallback((rating: number, feedback: string) => {
    setShowReview(false);
    downloadFn();

    // Store locally
    try {
      const reviews = JSON.parse(localStorage.getItem('mergepdf_reviews') || '[]');
      reviews.push({ rating, feedback, toolName: toolName || 'Unknown', date: new Date().toISOString() });
      localStorage.setItem('mergepdf_reviews', JSON.stringify(reviews));
    } catch { /* ignore */ }

    // Send via email (fire and forget)
    supabase.functions.invoke('send-review-email', {
      body: {
        rating,
        feedback,
        toolName: toolName || 'Unknown Tool',
        date: new Date().toISOString(),
      },
    }).catch(() => { /* silently fail */ });

    toast.success('Thanks for your feedback!');
  }, [downloadFn, toolName]);

  return { showReview, triggerDownload, handleSubmit, handleSkip };
}

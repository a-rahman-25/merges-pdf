import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook that intercepts downloads to show a review dialog first.
 * Usage:
 *   const { showReview, triggerDownload, handleSubmit, handleSkip } = useReviewBeforeDownload(downloadFn);
 *   // When user clicks download: triggerDownload()
 *   // Render: <ReviewDialog open={showReview} onSubmit={handleSubmit} onSkip={handleSkip} />
 */
export function useReviewBeforeDownload(downloadFn: () => void) {
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
    // Store review locally (could be sent to backend later)
    try {
      const reviews = JSON.parse(localStorage.getItem('mergepdf_reviews') || '[]');
      reviews.push({ rating, feedback, date: new Date().toISOString() });
      localStorage.setItem('mergepdf_reviews', JSON.stringify(reviews));
    } catch { /* ignore */ }
    toast.success('Thanks for your feedback!');
  }, [downloadFn]);

  return { showReview, triggerDownload, handleSubmit, handleSkip };
}

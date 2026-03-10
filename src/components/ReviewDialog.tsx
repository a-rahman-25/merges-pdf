import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReviewDialogProps {
  open: boolean;
  toolName: string;
  onSubmit: (rating: number, feedback: string) => void;
  onSkip: () => void;
}

const ReviewDialog = ({ open, toolName, onSubmit, onSkip }: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={onSkip}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                How was your experience?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Rate {toolName} before downloading
              </p>
            </div>
            <button onClick={onSkip} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-9 w-9 transition-colors ${
                    star <= (hover || rating)
                      ? 'fill-primary text-primary'
                      : 'text-border'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Feedback */}
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Any feedback? (optional)"
            rows={3}
            className="resize-none"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1 gap-2 rounded-xl"
            >
              <Download className="h-4 w-4" />
              Skip & Download
            </Button>
            <Button
              onClick={() => onSubmit(rating || 5, feedback)}
              disabled={rating === 0}
              className="flex-1 gap-2 rounded-xl"
            >
              <Star className="h-4 w-4" />
              Submit & Download
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewDialog;

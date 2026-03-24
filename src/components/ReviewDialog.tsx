import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Download, X, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const SURVEY_KEY = 'mergespdf_survey_dismissed';

const surveyOptions = [
  { id: 'free-ads', label: '🆓 Free with ads', desc: 'Keep all tools free, show non-intrusive ads' },
  { id: 'freemium', label: '💎 Freemium', desc: 'Basic tools free, pay for premium AI features' },
  { id: 'one-time', label: '💰 One-time purchase', desc: 'Pay once for lifetime access to all tools' },
  { id: 'no-ads-donate', label: '❤️ No ads, donations', desc: 'Ad-free experience, support via donations' },
];

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

  // Survey state
  const surveyDismissed = !!localStorage.getItem(SURVEY_KEY);
  const [surveySelected, setSurveySelected] = useState<string | null>(null);
  const [surveySubmitted, setSurveySubmitted] = useState(surveyDismissed);
  const showSurvey = !surveySubmitted;

  const handleSurveySubmit = async () => {
    if (!surveySelected) return;
    setSurveySubmitted(true);
    localStorage.setItem(SURVEY_KEY, 'true');

    // Persist + email (fire & forget)
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.from('contact_submissions').insert({
        name: 'Survey Response',
        email: 'survey@mergespdf.com',
        message: `Monetization preference: ${surveySelected}`,
      });
      await supabase.functions.invoke('send-survey-email', {
        body: { preference: surveySelected },
      });
    } catch { /* silent */ }
  };

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
          className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto"
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

          {/* Inline Survey (before download) */}
          {showSurvey && (
            <div className="rounded-xl border border-primary/20 bg-accent/30 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Quick question — help shape MergesPDF!</p>
              </div>
              <p className="text-xs text-muted-foreground">How would you prefer MergesPDF to sustain itself?</p>
              <div className="grid gap-2 grid-cols-2">
                {surveyOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSurveySelected(opt.id)}
                    className={`w-full text-left rounded-lg border p-2.5 transition-all ${
                      surveySelected === opt.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/30 hover:bg-accent/50'
                    }`}
                  >
                    <p className="text-xs font-semibold text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
              {surveySelected && (
                <Button size="sm" variant="outline" onClick={handleSurveySubmit} className="w-full gap-2 rounded-lg text-xs">
                  <Send className="h-3 w-3" /> Submit Survey
                </Button>
              )}
            </div>
          )}

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

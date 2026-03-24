import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SURVEY_KEY = 'mergespdf_survey_dismissed';

/**
 * Inline-only survey component for the homepage announcement banner.
 * The floating popup has been removed — survey now appears in the
 * pre-download ReviewDialog instead.
 */
const UserSurvey = ({ inline = false }: { inline?: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(SURVEY_KEY);
    if (dismissed) return;
    if (inline) setVisible(true);
  }, [inline]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(SURVEY_KEY, 'true');
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitted(true);
    localStorage.setItem(SURVEY_KEY, 'true');
    try {
      await supabase.from('contact_submissions').insert({
        name: 'Survey Response',
        email: 'survey@mergespdf.com',
        message: `Monetization preference: ${selected}`,
      });
      await supabase.functions.invoke('send-survey-email', {
        body: { preference: selected },
      });
    } catch { /* silent */ }
    toast.success('Thank you for your feedback!');
  };

  const options = [
    { id: 'free-ads', label: '🆓 Free with ads', desc: 'Keep all tools free, show non-intrusive ads' },
    { id: 'freemium', label: '💎 Freemium', desc: 'Basic tools free, pay for premium AI features' },
    { id: 'one-time', label: '💰 One-time purchase', desc: 'Pay once for lifetime access to all tools' },
    { id: 'no-ads-donate', label: '❤️ No ads, donations', desc: 'Ad-free experience, support via donations' },
  ];

  if (!visible || !inline) return null;

  return (
    <AnimatePresence>
      {!submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/30 p-6 sm:p-8"
        >
          <button onClick={dismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Dismiss survey">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-lg">Help shape MergesPDF's future</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                We'd love your input! How would you prefer MergesPDF to sustain itself?
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`w-full text-left rounded-xl border p-3 sm:p-4 transition-all ${
                  selected === opt.id
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/30 hover:bg-accent/50'
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!selected}
            size="sm"
            className="mt-4 rounded-xl gap-2"
          >
            <Send className="h-4 w-4" /> Submit Feedback
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/30 p-8 text-center"
        >
          <p className="text-3xl mb-2">🙏</p>
          <p className="font-display font-bold text-foreground text-lg">Thanks for your feedback!</p>
          <p className="text-sm text-muted-foreground mt-1">Your input helps shape the future of MergesPDF.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserSurvey;

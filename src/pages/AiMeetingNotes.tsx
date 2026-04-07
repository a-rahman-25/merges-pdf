import { motion } from 'framer-motion';
import AIMeetingNotes from '@/components/AIMeetingNotes';
import ToolPageLayout from '@/components/ToolPageLayout';
import SEOHead from '@/components/SEOHead';
import ToolFAQ from '@/components/ToolFAQ';

const faqs = [
  { q: 'What types of documents work?', a: 'Meeting transcripts, minutes, agendas with notes, project briefs, and any document with actionable content.' },
  { q: 'What does it extract?', a: 'Action items with assignees, key decisions, discussion points, important takeaways, and open follow-ups.' },
  { q: 'Can I use it for non-meeting documents?', a: 'Yes! It will still extract action items, decisions, and key points from any text-heavy PDF.' },
  { q: 'Is my document safe?', a: 'Yes, text is extracted locally in your browser. Only the extracted text is sent for AI processing, and nothing is stored.' },
];

const AiMeetingNotes = () => (
  <ToolPageLayout activeTab="ai-meeting-notes">
    <SEOHead
      title="AI Meeting Notes Extractor — Pull Action Items & Decisions | MergesPDF"
      description="Upload meeting transcripts and automatically extract action items, decisions, key points, and follow-ups using AI."
      path="/ai-meeting-notes"
      faqs={faqs}
    />
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI <span className="text-primary">Meeting Notes</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Extract action items, decisions, and key takeaways from transcripts
        </p>
      </div>
      <AIMeetingNotes />
      <ToolFAQ faqs={faqs} />
    </motion.div>
  </ToolPageLayout>
);

export default AiMeetingNotes;

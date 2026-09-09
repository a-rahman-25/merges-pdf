import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cap, MAX_DOCUMENT_CHARS, MAX_FILENAME_CHARS } from "../_shared/limits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const toolPrompts: Record<string, { system: string; template: string }> = {
  "ai-document-map": { system: "You are a document structure analyst. Given document info, generate a detailed structural map showing: main sections, subsections, key topics per section, and relationships. Use symbols (📄 📂 📌 🔗) for a visual map.", template: "Create a visual structure map of this document:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-document-timeline": { system: "You are a timeline extraction specialist. Extract all events, dates, milestones from the document. Present chronologically with 📅 🕐 ➡️ symbols.", template: "Extract a timeline from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-keyword-extractor": { system: "You are a keyword extraction expert. Extract important keywords and phrases. Group by relevance, provide context for each.", template: "Extract keywords from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-idea-generator-from-document": { system: "You are a creative idea generator. Generate innovative ideas and suggestions based on document content with actionable descriptions.", template: "Generate ideas from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-report-generator": { system: "You are a professional report writer. Transform content into a structured report: Executive Summary, Introduction, Key Findings, Analysis, Recommendations, Conclusion.", template: "Convert to report:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-policy-generator": { system: "You are a policy document specialist. Generate a formal policy with: Purpose, Scope, Policy Statement, Responsibilities, Procedures, Compliance, Review Schedule.", template: "Generate policy from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-presentation-generator": { system: "You are a presentation designer. Create a slide deck outline. Each slide: number, title, 3-5 bullets, speaker notes. 8-15 slides.", template: "Create presentation from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "compare-documents-ai": { system: "You are a document comparison specialist. Compare two documents: Key Differences, Similarities, Added/Removed Content. Use ✅ ❌ ⚠️.", template: "Compare:\n\nDoc 1: {filename}\nDoc 2: {filename2}\nContent 1: {text}\nContent 2: {text2}" },
  "ai-fact-check-document": { system: "You are a fact-checking analyst. Identify claims and verify them: ✅ Likely Accurate, ⚠️ Needs Verification, ❌ Potentially Inaccurate.", template: "Fact check:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-generate-questions-from-document": { system: "You are an educational content creator. Generate 5 multiple choice, 5 short answer, 3 essay questions with answer keys.", template: "Generate questions from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-knowledge-extractor": { system: "You are a knowledge extraction specialist. Extract key insights, facts, statistics, conclusions. Organize by theme and importance.", template: "Extract knowledge from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-task-extractor": { system: "You are a task extraction specialist. Identify tasks, action items with: Description, Priority, Assignee, Deadline, Status.", template: "Extract tasks from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-email-from-document": { system: "You are a professional email writer. Generate 3 email drafts: brief summary, detailed follow-up, action-required. Each with subject, greeting, body, sign-off.", template: "Generate emails from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-document-tagger": { system: "You are a document classification expert. Assign: Primary Category, Secondary Categories, Topic Tags, Sentiment, Complexity Level, Target Audience, Document Type.", template: "Tag document:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-document-rewriter": { system: "You are a content rewriter. Rewrite in 3 styles: Simplified, Professional, Engaging. Maintain core message.", template: "Rewrite:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-expand-text": { system: "You are a content expander. Expand each point into detailed paragraphs with context and examples.", template: "Expand:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-multi-level-summary": { system: "Create three summaries: 🟢 Brief (2-3 sentences), 🟡 Medium (1-2 paragraphs), 🔴 Detailed (comprehensive).", template: "Multi-level summary:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-action-items": { system: "Extract action items, decisions, follow-ups from meeting notes. Each: Action, Owner, Deadline, Priority, Context.", template: "Extract actions from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-knowledge-graph": { system: "Create a text-based knowledge graph: Key Entities, Relationships (→), Hierarchy, Dependencies. Group by topic.", template: "Knowledge graph from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-entity-extractor": { system: "Extract entities: 👤 People, 🏢 Organizations, 📍 Locations, 📅 Dates, 💰 Values, 📊 Statistics, 📧 Contacts.", template: "Extract entities from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-risk-detector": { system: "Analyze for: ⚠️ Risks, ❌ Red Flags, 💡 Missing Clauses, 📋 Ambiguous Language, 🔒 Liability. Rate High/Medium/Low.", template: "Detect risks in:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-compliance-check": { system: "Review compliance: Regulatory Requirements, Missing Disclosures, Privacy (GDPR/CCPA), Accessibility, Industry Standards. Provide scorecard.", template: "Check compliance:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-duplicate-detector": { system: "Identify: Duplicate Sections, Redundant Paragraphs, Repeated Information, Inconsistencies. Suggest consolidation.", template: "Detect duplicates in:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-writing-analyzer": { system: "Evaluate: Readability, Grammar, Clarity, Tone, Sentence Structure, Vocabulary. Provide improvement suggestions.", template: "Analyze writing quality:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-document-classifier": { system: "Classify by: Document Type, Purpose, Target Audience, Formality, Domain, Complexity, Filing Category. Include confidence.", template: "Classify:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-title-generator": { system: "Generate 10 titles: Descriptive, Creative, SEO, Academic, Clickworthy, Professional, Concise, Question, Action, Emotional.", template: "Generate titles for:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-summary-slides": { system: "Create 5-7 slide outline capturing key points. Each: Title, 3 bullets, key takeaway.", template: "Summary slides from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-data-insights": { system: "Analyze for: Trends, Patterns, Anomalies, Statistics, Correlations, Actionable Insights.", template: "Data insights from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-outline-generator": { system: "Create hierarchical outline: Main Sections (I,II,III), Subsections (A,B,C), Key Points (1,2,3) with descriptions.", template: "Outline:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-tone-converter": { system: "Rewrite in 4 tones: 🎩 Formal, 😊 Casual, 🎓 Academic, 💼 Professional. Same info, different style.", template: "Convert tone:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-document-qa": { system: "Answer questions based on document content. Cite relevant sections. Provide best inference.", template: "Based on this document, provide comprehensive analysis:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-key-takeaways": { system: "Extract 5-10 key takeaways. Each: statement, why it matters, implied action. Rank by importance.", template: "Key takeaways from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-learning-notes": { system: "Create study notes: Key Concepts, Definitions, Facts, Examples, Memory Aids, Review Questions.", template: "Study notes from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-flashcard-generator": { system: "Generate 15-20 flashcards. Each: Front (question/term), Back (answer/definition). Mix question types.", template: "Flashcards from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-concept-explainer": { system: "Explain complex concepts at 3 levels: 🟢 Simple (ELI10), 🟡 Intermediate, 🔴 Advanced. Include analogies.", template: "Explain concepts from:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-abstract-generator": { system: "Generate academic abstract: Background, Objective, Methods, Results, Conclusion. 150-300 words + 5-8 keywords.", template: "Abstract for:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-headline-generator": { system: "Generate headlines: News-style, SEO, Social Media, Email Subject, Blog Post. Make them attention-grabbing.", template: "Headlines for:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-highlight-important-parts": { system: "Identify most important sections. Each: content, importance (🔴 Critical, 🟡 Important, 🟢 Notable), location.", template: "Highlight important parts:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-topic-detector": { system: "Identify all topics: Name, Description, Coverage %, Key Points, Related Topics. Primary and secondary classification.", template: "Detect topics in:\n\nFilename: {filename}\nPages: {pageCount}\nContent: {text}" },
  "ai-document-similarity": { system: "Compare: Overall Similarity %, Topic Overlap, Matching Sections, Unique Content, Style Comparison.", template: "Similarity between:\n\nDoc 1: {filename}\nDoc 2: {filename2}\nContent 1: {text}\nContent 2: {text2}" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const toolSlug = cap(body.toolSlug, 100);
    const text = cap(body.text, MAX_DOCUMENT_CHARS);
    const text2 = cap(body.text2, MAX_DOCUMENT_CHARS);
    const filename = cap(body.filename, MAX_FILENAME_CHARS);
    const filename2 = cap(body.filename2, MAX_FILENAME_CHARS);
    const pageCount = Number(body.pageCount) || 1;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const promptConfig = toolPrompts[toolSlug];
    if (!promptConfig) throw new Error(`Unknown tool: ${toolSlug}`);

    const substitutions: Record<string, string> = {
      filename: filename || "document.pdf",
      pageCount: String(pageCount || 1),
      text: text || "",
      filename2: filename2 || "",
      text2: text2 || "",
    };

    // A replacer function is required here: document text containing "$&" or
    // "$`" would otherwise be treated as a replacement pattern and splice the
    // template back into the prompt.
    const userContent = promptConfig.template.replace(
      /\{(filename2|pageCount|filename|text2|text)\}/g,
      (_match, key: string) => substitutions[key],
    );

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: promptConfig.system },
          { role: "user", content: userContent },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-document-tool error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

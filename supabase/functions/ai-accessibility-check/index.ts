import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cap, MAX_DOCUMENT_CHARS, MAX_FILENAME_CHARS } from "../_shared/limits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const textContent = cap(body.textContent, MAX_DOCUMENT_CHARS);
    const filename = cap(body.filename, MAX_FILENAME_CHARS) || "document.pdf";
    const pageCount = Number(body.pageCount) || 1;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemContent = `You are a PDF accessibility expert specializing in WCAG 2.1 compliance. The user uploaded "${filename}" (${pageCount} pages). Analyze the document text for accessibility issues. Return your analysis in this exact markdown format:

## 📊 Accessibility Score
Give an overall score out of 100 and a brief verdict (e.g., "Good", "Needs Improvement", "Critical Issues").

## 🏗️ Document Structure
### Heading Hierarchy
- Analyze if headings follow a logical order (H1 → H2 → H3)
- Flag any skipped heading levels
- Note if there's a single H1

### Reading Order
- Assess if the content flows logically
- Flag any potential reading order issues

## 📝 Text & Content
### Language
- Is the document language identifiable?
- Are there sections in different languages?

### Text Alternatives
- Flag images that likely lack alt text
- Note any decorative vs informational images detected

### Color & Contrast
- Flag any potential color contrast issues based on text patterns
- Note if color alone is used to convey information

## 📋 Tables & Lists
- Are tables properly structured with headers?
- Do lists use proper markup?

## 🔗 Links & Navigation
- Are link texts descriptive (not "click here")?
- Is there a table of contents or bookmarks?

## ⚠️ Issues Found
List each issue with severity (🔴 Critical, 🟡 Warning, 🟢 Info):

| Severity | Issue | Recommendation |
|----------|-------|----------------|
| ... | ... | ... |

## ✅ Recommendations
Numbered list of specific actions to improve accessibility.

Be thorough but practical. Focus on actionable findings.

Here is the document text:

${textContent}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: "Perform a comprehensive accessibility audit of this document." },
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
    console.error("accessibility-check error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { textContent, filename, pageCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const hasRealText = textContent && textContent.trim().length > 50;
    if (!hasRealText) {
      return new Response(JSON.stringify({ error: "Could not extract enough text from the document." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert editor and writing coach. Analyze the provided document for grammar, style, and readability. Provide a structured review:

## 📊 Overall Score
Rate the document: ⭐⭐⭐⭐⭐ (5 stars) with a brief justification.
Include a readability level estimate (e.g., "College level", "High school", "Professional").

## ❌ Grammar & Spelling Errors
List specific errors found with corrections. Format:
- **Error**: "original text" → **Fix**: "corrected text" (explanation)

## ✍️ Style Improvements
Suggest improvements for clarity, conciseness, and flow:
- Wordy sentences that can be shortened
- Passive voice that could be active
- Jargon that could be simplified
- Repetitive words or phrases

## 📖 Readability Analysis
- Sentence length variety
- Paragraph structure
- Use of transitions
- Tone consistency

## 💡 Top 5 Recommendations
Prioritized list of the most impactful changes to improve the document.

Be specific with examples from the text. Be constructive, not just critical.`,
          },
          {
            role: "user",
            content: `Please review this document for grammar, style, and readability:\n\nFilename: ${filename}\nPages: ${pageCount}\n\nDocument text:\n${textContent}`,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("grammar-check error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

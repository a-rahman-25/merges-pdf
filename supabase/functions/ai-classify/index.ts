import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cap, capList, MAX_DOCUMENT_CHARS, MAX_DOCUMENTS, MAX_FILENAME_CHARS } from "../_shared/limits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const documents = capList<Record<string, unknown>>(body.documents, MAX_DOCUMENTS).map((d) => ({
      filename: cap(d.filename, MAX_FILENAME_CHARS) || "document.pdf",
      pageCount: Number(d.pageCount) || 1,
      textContent: cap(d.textContent, MAX_DOCUMENT_CHARS),
    }));
    if (documents.length === 0) {
      return new Response(JSON.stringify({ error: "No documents provided." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // documents = [{ filename, pageCount, textContent }]
    const docList = documents.map((d: any, i: number) =>
      `Document ${i + 1}: "${d.filename}" (${d.pageCount} pages)\nText excerpt:\n${(d.textContent || '').slice(0, 3000)}\n`
    ).join("\n---\n");

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
            content: `You are a document classification expert. Given one or more PDF documents with their extracted text, classify each document into appropriate categories. For each document provide:
1. **Category** (e.g., Invoice, Contract, Report, Resume, Letter, Legal Document, Academic Paper, Manual, Presentation, Financial Statement, Medical Record, etc.)
2. **Confidence** (High/Medium/Low)
3. **Key indicators** - what clues led to this classification
4. **Summary** - 1-2 sentence description of the document content
5. **Suggested tags** - relevant tags for organizing

Format your response clearly with each document labeled.`,
          },
          {
            role: "user",
            content: `Please classify the following documents:\n\n${docList}`,
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
    console.error("classify error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

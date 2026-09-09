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
    const text = cap(body.text, MAX_DOCUMENT_CHARS);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const hasRealText = textContent && textContent.trim().length > 50;
    const userContent = hasRealText
      ? `Please summarize this PDF document:\n\nFilename: ${filename}\nPages: ${pageCount}\n\nExtracted text content:\n${textContent}`
      : `Please summarize this PDF document:\n\nFilename: ${filename}\nPages: ${pageCount}\nContent description: ${text}`;

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
            content: "You are a document summarizer. Given the actual extracted text from a PDF document, provide a comprehensive, well-structured summary. Use bullet points for key topics. Be concise but thorough. Highlight the most important findings and conclusions.",
          },
          { role: "user", content: userContent },
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
    console.error("summarize error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

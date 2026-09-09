import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cap, capHistory, MAX_DOCUMENT_CHARS, MAX_FILENAME_CHARS, MAX_QUESTION_CHARS } from "../_shared/limits.ts";

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
    const question = cap(body.question, MAX_QUESTION_CHARS);
    const history = capHistory(body.history);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const hasText = textContent && textContent.trim().length > 50;

    const systemContent = hasText
      ? `You are a helpful document assistant. The user uploaded a PDF called "${filename}" (${pageCount} pages). Here is the extracted text content:\n\n${textContent}\n\nAnswer the user's questions based on this content. Be accurate, cite specific sections when possible, and be concise.`
      : `You are a helpful document assistant. The user has uploaded a PDF called "${filename}" with ${pageCount} pages. Answer questions about the document based on context. Be concise and helpful.`;

    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemContent },
    ];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: question });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
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
    console.error("qa error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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

    const hasRealText = textContent && textContent.trim().length > 50;
    if (!hasRealText) {
      return new Response(JSON.stringify({ error: "Could not extract enough text from the document. Please try a different PDF." }), {
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
            content: `You are an expert legal contract analyzer. Analyze the provided contract/legal document and provide a structured analysis with the following sections:

## 📋 Document Overview
Brief description of the document type and parties involved.

## ⚠️ Key Risks & Red Flags
List potential risks, unfavorable terms, or red flags. Rate each as 🔴 High, 🟡 Medium, or 🟢 Low risk.

## 📝 Key Clauses
Identify and explain the most important clauses (termination, liability, indemnification, confidentiality, non-compete, etc.)

## 💰 Financial Terms
Summarize payment terms, penalties, fees, or financial obligations.

## 📅 Important Dates & Deadlines
List any deadlines, renewal dates, notice periods, or expiration dates.

## ✅ Obligations & Responsibilities
Summarize what each party is required to do.

## 💡 Recommendations
Provide actionable recommendations for the reader — things to negotiate, clarify, or watch out for.

Be thorough but concise. Use bullet points for clarity.`,
          },
          {
            role: "user",
            content: `Please analyze this contract/legal document:\n\nFilename: ${filename}\nPages: ${pageCount}\n\nDocument text:\n${textContent}`,
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
    console.error("contract-analyzer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

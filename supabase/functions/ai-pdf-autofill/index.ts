import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cap, capList, MAX_DOCUMENT_CHARS, MAX_FILENAME_CHARS, MAX_FORM_FIELDS } from "../_shared/limits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const formFields = capList<{ name?: string; type?: string }>(body.formFields, MAX_FORM_FIELDS);
    const contextText = cap(body.contextText, MAX_DOCUMENT_CHARS);
    const filename = cap(body.filename, MAX_FILENAME_CHARS) || "document.pdf";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!formFields || !Array.isArray(formFields) || formFields.length === 0) {
      return new Response(JSON.stringify({ error: "No form fields detected in this PDF." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fieldList = formFields.map((f: any) => `- Field name: "${f.name}", type: ${f.type || 'text'}`).join('\n');

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
            content: `You are an intelligent PDF form filling assistant. Given a list of form fields and context information, suggest appropriate values for each field.

Return your response as a JSON array where each element has:
- "name": the exact field name
- "value": the suggested value
- "confidence": "high", "medium", or "low"
- "reasoning": brief explanation of why this value was suggested

Only suggest values where you have reasonable context. For fields without enough context, set value to "" and confidence to "low".

IMPORTANT: Return ONLY the JSON array, no other text.`,
          },
          {
            role: "user",
            content: `PDF Form: ${filename}\n\nForm fields:\n${fieldList}\n\nContext/instructions from user:\n${contextText || 'No additional context provided. Please suggest common/default values where appropriate.'}`,
          },
        ],
        stream: false,
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Try to parse the JSON from the AI response
    let suggestions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      suggestions = [];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("pdf-autofill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

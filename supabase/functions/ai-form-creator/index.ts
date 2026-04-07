import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { description, formType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemContent = `You are a PDF form design expert. The user wants to create a "${formType}" form. Based on their description, generate a comprehensive form structure in markdown format.

Return the form design in this exact format:

## 📄 Form: [Form Title]

### Form Layout

For each section, list all fields with their properties:

#### Section 1: [Section Name]

| Field Label | Type | Required | Options/Validation |
|-------------|------|----------|-------------------|
| Full Name | text | ✅ | Max 100 chars |
| Email | email | ✅ | Valid email format |
| Gender | dropdown | ❌ | Male, Female, Other |
| Agree to Terms | checkbox | ✅ | — |

#### Section 2: [Section Name]
(continue pattern)

### 📐 Layout Suggestions
- Page size, margins, font recommendations
- Section spacing and grouping

### 💡 Best Practices
- Tips for this specific form type
- Compliance notes (if applicable)

### 📋 Generated Form Fields (JSON)
\`\`\`json
{
  "title": "Form Title",
  "sections": [
    {
      "name": "Section Name",
      "fields": [
        { "label": "Field Name", "type": "text|email|dropdown|checkbox|date|number|textarea|signature", "required": true, "options": [], "placeholder": "" }
      ]
    }
  ]
}
\`\`\`

Be thorough and include all fields that would typically appear on this type of form. Make it professional and complete.`;

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
          { role: "user", content: `Create a ${formType} form with the following requirements: ${description}` },
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
    console.error("form-creator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

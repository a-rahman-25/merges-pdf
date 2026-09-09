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

    const systemContent = `You are an expert invoice and receipt parser. The user uploaded "${filename}" (${pageCount} pages). Here is the text:\n\n${textContent}\n\nExtract ALL financial information from this invoice/receipt. Return your analysis in this exact markdown format:

## 🏢 Vendor Information
- **Company Name:** 
- **Address:** 
- **Phone:** 
- **Email:** 
- **Tax ID / VAT:** 

## 🧾 Invoice Details
- **Invoice Number:** 
- **Invoice Date:** 
- **Due Date:** 
- **Payment Terms:** 
- **Currency:** 

## 👤 Bill To
- **Customer Name:** 
- **Address:** 
- **Account Number:** 

## 📦 Line Items

| # | Description | Qty | Unit Price | Total |
|---|-------------|-----|-----------|-------|
| 1 | ... | ... | ... | ... |

## 💰 Financial Summary
- **Subtotal:** 
- **Tax Rate:** 
- **Tax Amount:** 
- **Discount:** 
- **Shipping:** 
- **Total Due:** 
- **Amount Paid:** 
- **Balance Due:** 

## 💳 Payment Information
- **Payment Method:** 
- **Bank Details:** 
- **Reference Number:** 

Fill in all fields that are available. Use "N/A" for fields not found in the document. Be precise with numbers and dates.`;

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
          { role: "user", content: "Parse this invoice/receipt and extract all line items, totals, dates, vendor info, and payment details." },
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
    console.error("invoice-parser error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

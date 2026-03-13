import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPPORT_EMAIL = "merge.pdf.st@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { rating, feedback, toolName, date } = await req.json();

    if (!rating || !toolName) {
      return new Response(JSON.stringify({ error: "Missing rating or toolName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const emailBody = `
      <h2>New Review from MergesPDF</h2>
      <p><strong>Tool:</strong> ${toolName}</p>
      <p><strong>Rating:</strong> ${stars} (${rating}/5)</p>
      <p><strong>Feedback:</strong> ${feedback || "(no feedback)"}</p>
      <p><strong>Date:</strong> ${date || new Date().toISOString()}</p>
    `;

    if (!RESEND_API_KEY) {
      console.log("No RESEND_API_KEY set. Review logged:", { rating, feedback, toolName, date });
      return new Response(JSON.stringify({ success: true, message: "Review logged (email not configured)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MergesPDF Reviews <reviews@mergespdf.com>",
        to: [SUPPORT_EMAIL],
        subject: `${stars} Review for ${toolName}`,
        html: emailBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      // Still return success — don't block user download
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("review email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

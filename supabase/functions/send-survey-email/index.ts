import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPPORT_EMAIL = "merge.pdf.st@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ success: false, error: "Email not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { preference } = await req.json();

    const labelMap: Record<string, string> = {
      'free-ads': '🆓 Free with ads',
      'freemium': '💎 Freemium',
      'one-time': '💰 One-time purchase',
      'no-ads-donate': '❤️ No ads, donations',
    };

    const emailBody = `
      <h2>📊 New Survey Response — MergesPDF</h2>
      <p><strong>User Preference:</strong> ${labelMap[preference] || preference}</p>
      <p><strong>Preference ID:</strong> ${preference}</p>
      <p><strong>Date:</strong> ${new Date().toISOString()}</p>
      <hr />
      <p style="color:#888;font-size:12px;">This is an automated notification from MergesPDF's monetization survey.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MergesPDF Survey <reviews@mergespdf.com>",
        to: [SUPPORT_EMAIL],
        subject: `📊 Survey: User prefers "${labelMap[preference] || preference}"`,
        html: emailBody,
      }),
    });

    const resBody = await res.text();
    console.log("Survey email sent:", res.status, resBody);

    return new Response(JSON.stringify({ success: res.ok }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("survey email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

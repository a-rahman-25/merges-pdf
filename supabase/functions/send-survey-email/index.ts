import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Query existing survey results for a tally
    let tallyHtml = '';
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data: allResponses } = await sb
        .from('contact_submissions')
        .select('message')
        .like('message', 'Monetization preference:%');

      if (allResponses && allResponses.length > 0) {
        const counts: Record<string, number> = {};
        for (const r of allResponses) {
          const pref = r.message.replace('Monetization preference: ', '');
          counts[pref] = (counts[pref] || 0) + 1;
        }
        // Include the current vote
        counts[preference] = (counts[preference] || 0) + 1;
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        tallyHtml = `
          <h3>📊 Current Tally (${total} total votes)</h3>
          <table style="border-collapse:collapse;width:100%;max-width:400px;">
            ${sorted.map(([key, count], i) => {
              const label = labelMap[key] || key;
              const pct = ((count / total) * 100).toFixed(1);
              const isTop = i === 0;
              return `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:8px;font-weight:${isTop ? 'bold' : 'normal'};">${isTop ? '🏆 ' : ''}${label}</td>
                <td style="padding:8px;text-align:right;">${count} votes (${pct}%)</td>
              </tr>`;
            }).join('')}
          </table>
        `;
      }
    } catch (e) {
      console.error("Failed to fetch tally:", e);
    }

    const emailBody = `
      <h2>📊 New Survey Response — MergesPDF</h2>
      <p><strong>User Preference:</strong> ${labelMap[preference] || preference}</p>
      <p><strong>Preference ID:</strong> ${preference}</p>
      <p><strong>Date:</strong> ${new Date().toISOString()}</p>
      <hr />
      ${tallyHtml}
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
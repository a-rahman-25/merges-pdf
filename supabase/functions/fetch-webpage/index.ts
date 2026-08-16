const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let target: URL;
    try {
      target = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      return new Response(JSON.stringify({ error: 'Only http(s) URLs are supported' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Block obvious internal targets
    const host = target.hostname.toLowerCase();
    if (
      host === 'localhost' || host === '0.0.0.0' || host.endsWith('.local') ||
      /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) || /^169\.254\./.test(host)
    ) {
      return new Response(JSON.stringify({ error: 'This host is not allowed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(target.toString(), {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MergesPDF/1.0; +https://mergespdf.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const body = await res.text();
      console.error(`fetch-webpage failed [${res.status}]: ${body.slice(0, 300)}`);
      return new Response(
        JSON.stringify({ error: `The page returned status ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('html') && !ct.includes('text/plain') && ct !== '') {
      return new Response(JSON.stringify({ error: `Unsupported content type: ${ct}` }), {
        status: 415,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let html = await res.text();
    if (html.length > 2_000_000) html = html.slice(0, 2_000_000);

    return new Response(
      JSON.stringify({ html, finalUrl: res.url || target.toString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('fetch-webpage error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Boots one edge function in-process with a stubbed AI gateway, posts an
// oversized payload at it, and reports how large the prompt it would have sent
// actually was. Proves the input caps bound cost before anything is deployed.
//
//   deno run -A scripts/ai-audit/edge-limit-check.ts <path-to-index.ts> <payload.json>

const target = Deno.args[0];
const payload = JSON.parse(await Deno.readTextFile(Deno.args[1]));

let captured: { messages?: Array<{ content?: unknown }> } | null = null;
const realFetch = globalThis.fetch;

globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.includes("ai.gateway.lovable.dev")) {
    captured = JSON.parse(String(init?.body ?? "{}"));
    // Some functions stream and some read a single completion; answer in kind.
    if ((captured as { stream?: boolean }).stream) {
      return new Response(
        'data: {"choices":[{"delta":{"content":"stubbed"}}]}\n\ndata: [DONE]\n\n',
        { status: 200, headers: { "Content-Type": "text/event-stream" } },
      );
    }
    return new Response(
      JSON.stringify({ choices: [{ message: { content: "{}" } }] }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
  return await realFetch(input as string | URL | Request, init);
};

Deno.env.set("LOVABLE_API_KEY", "test-key");

await import(target);
await new Promise((r) => setTimeout(r, 500));

const resp = await realFetch("http://127.0.0.1:8000/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const responseBody = await resp.text();

const messages = captured?.messages ?? [];
const promptChars = messages.reduce((sum, m) => sum + String(m.content ?? "").length, 0);

console.log(JSON.stringify({
  status: resp.status,
  gatewayCalled: captured !== null,
  messageCount: messages.length,
  promptChars,
  response: responseBody.slice(0, 60),
}));

Deno.exit(0);

import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type FBEntry = {
  id: string; // page id
  time: number;
  messaging?: Array<{
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: {
      mid: string;
      text?: string;
      attachments?: Array<{ type: string; payload: { url?: string } }>;
    };
  }>;
};

type FBPayload = { object: string; entry: FBEntry[] };

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature || !signature.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const provided = signature.slice("sha256=".length);
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(provided, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function persistMessage(entry: FBEntry) {
  const pageId = entry.id;

  // Find which user owns this page
  const { data: page } = await supabaseAdmin
    .from("facebook_pages")
    .select("id, user_id, page_name")
    .eq("page_id", pageId)
    .maybeSingle();

  if (!page) {
    console.warn(`[fb-webhook] page ${pageId} not connected to any user`);
    return;
  }

  for (const m of entry.messaging ?? []) {
    // sender.id === pageId means it's an echo of an outgoing msg → skip
    const fbUserId = m.sender.id;
    if (fbUserId === pageId) continue;
    if (!m.message) continue;

    const text = m.message.text ?? "[attachment]";
    const customerName = `Customer ${fbUserId.slice(-4)}`;

    // Find or create conversation
    let { data: conv } = await supabaseAdmin
      .from("conversations")
      .select("id, unread_count")
      .eq("user_id", page.user_id)
      .eq("page_id", page.id)
      .eq("fb_user_id", fbUserId)
      .maybeSingle();

    if (!conv) {
      const ins = await supabaseAdmin
        .from("conversations")
        .insert({
          user_id: page.user_id,
          page_id: page.id,
          fb_user_id: fbUserId,
          customer_name: customerName,
          last_message: text,
          unread_count: 1,
        })
        .select("id, unread_count")
        .single();
      if (ins.error) {
        console.error("[fb-webhook] conv insert failed", ins.error);
        continue;
      }
      conv = ins.data;
    } else {
      await supabaseAdmin
        .from("conversations")
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
          unread_count: (conv.unread_count ?? 0) + 1,
        })
        .eq("id", conv.id);
    }

    await supabaseAdmin.from("messages").insert({
      conversation_id: conv.id,
      user_id: page.user_id,
      sender: "customer",
      content: text,
      fb_message_id: m.message.mid,
      is_read: false,
    });
  }
}

export const Route = createFileRoute("/api/public/webhooks/facebook")({
  server: {
    handlers: {
      // Facebook verification challenge
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");

        const expected = process.env.FB_VERIFY_TOKEN;
        if (!expected) {
          console.warn("[fb-webhook] FB_VERIFY_TOKEN not set — accepting any token (mock mode)");
        }

        if (mode === "subscribe" && (!expected || token === expected) && challenge) {
          return new Response(challenge, { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },

      POST: async ({ request }) => {
        const body = await request.text();
        const secret = process.env.FB_APP_SECRET;

        if (secret) {
          const sig = request.headers.get("x-hub-signature-256");
          if (!verifySignature(body, sig, secret)) {
            console.warn("[fb-webhook] invalid signature");
            return new Response("Invalid signature", { status: 401 });
          }
        } else {
          console.warn("[fb-webhook] FB_APP_SECRET not set — skipping signature verification (mock mode)");
        }

        let payload: FBPayload;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (payload.object !== "page") {
          return new Response("ok", { status: 200 });
        }

        try {
          await Promise.all((payload.entry ?? []).map(persistMessage));
        } catch (e) {
          console.error("[fb-webhook] persist error", e);
        }

        // Always 200 so Facebook doesn't retry
        return new Response("EVENT_RECEIVED", { status: 200 });
      },
    },
  },
});

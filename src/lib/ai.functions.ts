import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `You are an expert Bengali e-commerce customer support assistant for FCommerce sellers in Bangladesh.

RULES:
- Reply in the SAME language the customer used (Bangla/Banglish/English).
- Be warm, friendly, concise (1-3 short sentences).
- Use polite Bangla terms: "apu", "vai", "dhonnobad", "ji".
- If the customer asks price/stock/delivery and you don't have data, give a helpful generic answer and ask one clarifying question.
- Never invent specific prices, stock numbers, or order IDs.
- Don't use emojis unless the customer did.
- Output ONLY the reply text — no quotes, no labels, no explanations.`;

export const suggestReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        conversationId: z.string().uuid(),
        customMessage: z.string().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    // Fetch last 10 messages for context
    const { data: msgs, error } = await supabase
      .from("messages")
      .select("sender, content, created_at")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);

    const history = (msgs ?? []).reverse();
    const contextLines = history
      .map((m) => `${m.sender === "agent" ? "Seller" : "Customer"}: ${m.content ?? ""}`)
      .join("\n");

    const userPrompt = data.customMessage
      ? `Conversation so far:\n${contextLines}\n\nDraft a reply addressing: ${data.customMessage}`
      : `Conversation so far:\n${contextLines}\n\nDraft the seller's next reply to the customer's latest message.`;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("AI rate limit hit — try again in a moment");
      if (res.status === 402) throw new Error("AI credits exhausted — add funds in Settings");
      throw new Error(`AI error: ${res.status}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) throw new Error("Empty AI response");

    return { reply };
  });

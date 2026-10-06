/* global process */
import { GoogleGenAI } from "@google/genai";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY = 8;
const MAX_CATALOGUE_PRODUCTS = 30;
const requests = new Map();


const STORE_CONTEXT = `
Yumi Store customer-support facts:
- Orders are processed 1-2 business days after payment confirmation; delivery usually takes 5-7 business days depending on location.
- Tracking details are available in the customer's account after shipment.
- Any shipping charge is displayed at checkout.
- Returns are accepted within 7 days of delivery when products are unused, unwashed, and in original packaging.
- Refunds take 5-7 business days after the returned item passes inspection.
- Customized or personalized products cannot be returned.
- The store accepts prepaid online payments only; Cash on Delivery is unavailable.
- Phone support: +91 7349558926. Instagram: @yumi_dxb. Location: Mangaluru, Karnataka, India.
`;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((time) => now - time < 60_000);
  recent.push(now);
  requests.set(ip, recent);
  return recent.length > 12;
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-MAX_HISTORY).flatMap((item) => {
    const content = cleanText(item?.content, 1000);
    return content && (item.role === "user" || item.role === "assistant") ? [{ role: item.role, content }] : [];
  });
}

function cleanCatalogue(catalogue) {
  if (!Array.isArray(catalogue)) return [];
  return catalogue.slice(0, MAX_CATALOGUE_PRODUCTS).map((item) => ({
    id: cleanText(item?.id, 100),
    name: cleanText(item?.name, 120),
    price: Number.isFinite(Number(item?.price)) ? Number(item.price) : null,
    category: cleanText(item?.category, 60),
    description: cleanText(item?.description, 300),
  })).filter((item) => item.name);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ message: "Chat support is not configured yet." });
  if (isRateLimited(getClientIp(req))) return res.status(429).json({ message: "Please wait a moment before sending another message." });

  const message = cleanText(req.body?.message, MAX_MESSAGE_LENGTH);
  if (!message) return res.status(400).json({ message: "Please enter a message." });

  const history = cleanHistory(req.body?.history);
  const catalogue = cleanCatalogue(req.body?.catalogue);
  const instructions = `You are Yumi Store's customer-support assistant.

Be warm, concise, and helpful.

Only use the verified store facts and product catalogue provided below.

Never invent products, prices, discounts, or availability.

If you recommend a product, you MUST end your reply with a clickable Markdown link.

Use EXACTLY this format:

[🛍️ View Product](/product/PRODUCT_ID)

Replace PRODUCT_ID with the actual product id from the catalogue.

DO NOT write:
/product/PRODUCT_ID

DO NOT write:
(/product/PRODUCT_ID)

DO NOT use HTML.

Always use Markdown link syntax.

For order-specific questions, explain that customers can check Order History after signing in or contact support.

${STORE_CONTEXT}

Current catalogue:
${JSON.stringify(catalogue)}`;

  try {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `${instructions}

Conversation:
${history.map(h => `${h.role}: ${h.content}`).join("\n")}

User: ${message}

Assistant:`;

  const result = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
});

let reply = cleanText(result.text ?? "", 3000);

reply = reply.replace(
  /\[([^\]]+)\]\s*\r?\n+\s*\(([^)]+)\)/g,
  "[$1]($2)"
);
reply = reply.trim();
console.log("FINAL REPLY:");
console.log(reply);
  if (!reply) {
    return res.status(502).json({
      message: "Support returned an empty response.",
    });
  }

  return res.status(200).json({ reply });

} catch (error) {
  console.error("Gemini SDK Error:");
console.error(error);
console.error(error?.stack);
  return res.status(500).json({
    message: error.message || "Support is temporarily unavailable.",
  });
}
}
   
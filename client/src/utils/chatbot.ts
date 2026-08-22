/**
 * COUNTER JOURNAL DESIGN NOTE: Bot replies remain concise counter-service
 * templates, now covering the local ordering tools without inventing policy.
 */
import Fuse from "fuse.js";
import { cafe, menu, type MenuItem } from "@/data/cafeData";
import { milkOptions, sugarOptions } from "@/lib/orderOptions";

export type ChatIntent = "greeting" | "hours" | "location" | "menu_browse" | "item_lookup" | "price" | "allergen" | "delivery" | "customization" | "favorites" | "tips" | "checkout" | "farewell" | "fallback";
export type ChatReply = { text: string; intent: ChatIntent; confidence: number };
const fuse = new Fuse(menu, { keys: ["name", "category", "tags", "allergens"], threshold: 0.48, ignoreLocation: true });
const unknown = "I don't have that information — please check with staff before ordering.";
const stripQuestionWords = (message: string) => message.replace(/\b(how|much|is|a|an|the|do|you|have|with|what|about|price|cost|can|i|get|tell|me|please)\b/g, " ").replace(/\s+/g, " ").trim();
const itemByMessage = (message: string) => { const normalized = stripQuestionWords(message); return menu.find((item) => normalized.includes(item.name.toLowerCase())) ?? fuse.search(normalized)[0]?.item; };
const hoursText = Object.entries(cafe.hours).map(([days, hours]) => `${days}: ${hours}`).join(" · ");
const noun = (item: MenuItem) => `${item.name} is ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)} before any extra espresso shots.`;
const customizationMessage = `Coffee and tea can be customized before adding to your order. Choose milk (${milkOptions.join(", ")}), sugar (${sugarOptions.join(", ")}), and up to three extra espresso shots on coffee. Extra shots are ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cafe.extraShotPrice)} each.`;

export function answerQuestion(rawQuestion: string): ChatReply {
  const question = rawQuestion.trim().toLowerCase();
  if (!question) return { text: "Ask about our hours, menu, drink customizations, favorites, or checkout.", intent: "fallback", confidence: 1 };
  if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(question)) return { text: "Hi — I can help with menu items, drink options, favorites, checkout, prices, allergens, hours, and location.", intent: "greeting", confidence: 0.98 };
  if (/\b(bye|goodbye|see you|thanks|thank you)\b/.test(question)) return { text: "You’re welcome. See you at the counter.", intent: "farewell", confidence: 0.96 };
  if (/\b(hours?|open|close|thanksgiving|holiday)\b/.test(question)) return { text: `Our regular hours are ${hoursText}. We don’t have holiday hours listed, so please check with staff before visiting.`, intent: "hours", confidence: 0.96 };
  if (/\b(checkout|confirm|place.*order|order.*confirm|review.*order|order.*review|cart)\b/.test(question)) return { text: "Add items to your cart, choose pickup or delivery, select a tip at checkout, and use “Review final order.” The confirmation ticket shows every customization and total before the prototype order is placed.", intent: "checkout", confidence: 0.96 };
  if (/\b(where|location|address|find|main st)\b/.test(question)) return { text: `You can find us at ${cafe.location}. You can also call ${cafe.phone}.`, intent: "location", confidence: 0.98 };
  if (/\b(favorite|favourite|regular|save.*drink|reorder)\b/.test(question)) return { text: "Open a coffee or tea, choose your milk, sugar, and shots, then select “Save as regular.” Saved drinks stay in this browser and appear in your cart drawer for one-tap reordering.", intent: "favorites", confidence: 0.96 };
  if (/\b(tip|tips|tipping|gratuity)\b/.test(question)) return { text: "At checkout, choose no tip or a 10%, 15%, or 20% thank-you tip. The tip is calculated from the food and drink subtotal and is shown on the final confirmation ticket.", intent: "tips", confidence: 0.97 };
  if (/\b(deliver|delivery)\b/.test(question)) return { text: `Delivery is available in this prototype with a ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cafe.deliveryFee)} fee. We can’t confirm an address in chat — please use checkout to enter it.`, intent: "delivery", confidence: 0.9 };
  if (/\b(milk|oat|almond|soy|sugar|sweet|shot|customi[sz]e|modify)\b/.test(question)) return { text: customizationMessage, intent: "customization", confidence: 0.95 };
  const item = itemByMessage(question);
  if (/\b(allergen|allergy|allergic|gluten|dairy|vegan|vegetarian|nut|egg|safe|free)\b/.test(question)) {
    if (/\b(severe|safe|nut-free|and nut-free)\b/.test(question) && !item) return { text: unknown, intent: "allergen", confidence: 0.74 };
    if (item) { const details = item.allergens.length ? `contains ${item.allergens.join(", ")}` : "has no listed allergens"; const caution = item.mayContain?.length ? ` It may contain ${item.mayContain.join(", ")}.` : ""; const dietary = item.tags?.length ? ` Tags: ${item.tags.join(", ")}.` : ""; return { text: `${item.name} ${details}.${caution}${dietary} Please check with staff for severe allergies.`, intent: "allergen", confidence: 0.9 }; }
    const matching = menu.filter((entry) => question.includes("dairy") ? !entry.allergens.includes("dairy") : question.includes("vegan") ? entry.tags?.includes("vegan") : false).map((entry) => entry.name);
    if (matching.length) return { text: `Our listed options are ${matching.join(", ")}. Please check with staff for cross-contact or severe allergies.`, intent: "allergen", confidence: 0.84 };
    return { text: unknown, intent: "allergen", confidence: 0.6 };
  }
  if (/\b(price|cost|how much)\b/.test(question) && item) return { text: noun(item), intent: "price", confidence: 0.92 };
  if (/\b(menu|have|offer|browse|seller|discount)\b/.test(question)) {
    if (item) return { text: `${item.name}: ${item.description} ${noun(item)}`, intent: "item_lookup", confidence: 0.83 };
    if (/best seller|discount/.test(question)) return { text: unknown, intent: "fallback", confidence: 0.72 };
    return { text: `Our menu includes ${Array.from(new Set(menu.map((entry) => entry.category))).join(", ")}. Ask about a specific item for its price, allergens, or customization options.`, intent: "menu_browse", confidence: 0.94 };
  }
  if (item) return { text: `${item.name}: ${item.description} ${noun(item)}`, intent: "item_lookup", confidence: 0.86 };
  return { text: unknown, intent: "fallback", confidence: 0.35 };
}

export const quickReplies = ["Customize drinks?", "Save a favorite?", "Tipping?", "Checkout help?"];
export const testQuestions = [
  "What are your hours on Thanksgiving?", "Do you have oat milk lattes?", "Is the blueberry muffin gluten-free AND nut-free?", "What's safe for someone with a severe nut allergy?", "Can you deliver to 456 Oak Avenue?", "Do you have anything without dairy?", "How much is a capuccino?", "What's your best seller?", "Can I get a discount for a large order?", "Is the caprese vegan?", "How do I save a custom drink as a favorite?", "Can I add an extra shot to a caramel latte?", "How is the tip calculated?", "Where do I confirm my final order?",
];

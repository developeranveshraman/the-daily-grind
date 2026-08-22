/**
 * COUNTER JOURNAL DESIGN NOTE: Completed local orders become time-stamped
 * service-board entries immediately, without requiring a server or API call.
 */
import type { CartItem } from "@/contexts/CartContext";
import type { SaleRow } from "@/data/analytics";

const storageKey = "daily-grind-live-sales";
const eventName = "daily-grind-live-order";
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function getLiveSales(): SaleRow[] { try { const stored = localStorage.getItem(storageKey); return stored ? JSON.parse(stored) as SaleRow[] : []; } catch { return []; } }
export function recordLiveOrder(items: CartItem[]) {
  const placedAt = new Date();
  const rows: SaleRow[] = items.map(({ item, quantity, unitPrice, lineTotal }) => ({ date: localDate(placedAt), day_of_week: dayNames[placedAt.getDay()], time_of_day: placedAt.getHours(), item_name: item.name, category: item.category, quantity_sold: quantity, unit_price: Number(unitPrice.toFixed(2)), total_revenue: Number(lineTotal.toFixed(2)) }));
  const nextRows = [...getLiveSales(), ...rows].slice(-150);
  localStorage.setItem(storageKey, JSON.stringify(nextRows));
  window.dispatchEvent(new CustomEvent(eventName));
}
export function clearLiveSales() { localStorage.removeItem(storageKey); window.dispatchEvent(new CustomEvent(eventName)); }
export function subscribeToLiveOrders(callback: () => void) { window.addEventListener(eventName, callback); window.addEventListener("storage", callback); return () => { window.removeEventListener(eventName, callback); window.removeEventListener("storage", callback); }; }

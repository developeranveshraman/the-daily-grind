/**
 * COUNTER JOURNAL DESIGN NOTE: Menu cards resemble concise paper tickets with
 * clear order information, tactile imagery, and caramel action points.
 */
import { Plus } from "lucide-react";
import { DrinkCustomizer } from "@/components/DrinkCustomizer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, imageFor, type MenuItem } from "@/data/cafeData";
import { isCustomizableDrink } from "@/lib/orderOptions";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const notes = [...item.allergens, ...(item.mayContain ? item.mayContain.map((allergen) => `may contain ${allergen}`) : [])];
  const crop: Record<string, string> = { espresso: "object-center", cappuccino: "object-left", "caramel-latte": "object-center", "cold-brew": "object-right", "english-breakfast": "object-left", chamomile: "object-right", "butter-croissant": "object-left", "blueberry-muffin": "object-center", "almond-biscotti": "object-right", "avocado-toast": "object-center", "breakfast-burrito": "object-right", "turkey-swiss": "object-left", caprese: "object-right" };
  return <article className="menu-card group overflow-hidden bg-white shadow-[0_14px_40px_rgba(58,42,30,0.08)]">
    <div className="ticket-meta"><span><i className="ticket-dot" /> Fresh on the counter</span><span>#{item.id.slice(0, 3).toUpperCase()}</span></div>
    <div className="relative h-52 overflow-hidden bg-[#e9e0d4]">
      <img className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${crop[item.id]}`} src={imageFor(item)} alt={`${item.name} from The Daily Grind`} />
      <span className="absolute left-4 top-4 bg-[#faf6f1]/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3a2a1e]">{item.category}</span>
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-4"><h3 className="font-display text-2xl leading-none text-[#3a2a1e]">{item.name}</h3><span className="whitespace-nowrap text-sm font-bold text-[#c97b3d]">{formatPrice(item.price)}</span></div>
      <p className="mt-3 min-h-12 text-sm leading-6 text-[#645447]">{item.description}</p>
      <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">{notes.map((note) => <span key={note} className="allergen-pill">{note}</span>)}{item.tags?.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}</div>
      {item.notes && <p className="mt-2 text-xs italic text-[#6b8f71]">{item.notes}</p>}
      {isCustomizableDrink(item.category) ? <DrinkCustomizer item={item} /> : <button onClick={() => addItem(item.id)} className="mt-5 flex w-full items-center justify-center gap-2 border border-[#c97b3d] bg-[#c97b3d] px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-[#3a2a1e] hover:bg-[#3a2a1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c97b3d]"><Plus size={16} aria-hidden="true" /> Add to order</button>}
    </div>
  </article>;
}

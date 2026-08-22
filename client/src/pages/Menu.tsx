/**
 * COUNTER JOURNAL DESIGN NOTE: The menu reads as a clean paper menu with
 * category tabs and enough breathing room for fast, confident choices.
 */
import { useState } from "react";
import { MenuCard } from "@/components/MenuCard";
import { categories, menu, type MenuCategory } from "@/data/cafeData";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Coffee");
  const items = menu.filter((item) => item.category === activeCategory);
  return <section className="px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-8 border-b-4 border-double border-[#3a2a1e] pb-10 lg:grid-cols-[1fr_.75fr]"><div><p className="section-kicker">The order board</p><h1 className="mt-4 font-display text-6xl leading-none">Made for the<br /><em className="font-normal text-[#c97b3d]">daily</em> repeat.</h1></div><p className="self-end max-w-md text-base leading-7 text-[#645447]">Espresso pulled carefully, pastries set out early, and an easy way to take your favorites wherever you’re headed.</p></div><div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)} className={`shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.13em] transition ${activeCategory === category ? "bg-[#3a2a1e] text-[#faf6f1]" : "border border-[#3a2a1e]/25 text-[#3a2a1e] hover:border-[#c97b3d] hover:text-[#c97b3d]"}`}>{category}</button>)}</div><div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <MenuCard key={item.id} item={item} />)}</div></div></section>;
}

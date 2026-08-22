/**
 * COUNTER JOURNAL DESIGN NOTE: The shared shell uses a service-counter rail,
 * double rules, and relaxed editorial spacing to unify every café page.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import { cafe, assets } from "@/data/cafeData";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { ChatWidget } from "@/components/ChatWidget";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" }, { href: "/menu", label: "Menu" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }, { href: "/dashboard", label: "Dashboard" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  useEffect(() => setMobileOpen(false), [location]);
  return <div className="min-h-screen bg-[#faf6f1] text-[#3a2a1e]">
    <header className="sticky top-0 z-40 border-b border-[#3a2a1e]/15 bg-[#faf6f1]/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-[#3a2a1e] no-underline"><img className="h-12 w-12 object-contain" src={assets.logo} alt="The Daily Grind cup logo" /><span className="leading-none"><span className="block text-[9px] font-bold tracking-[0.27em]">THE</span><span className="font-display block text-2xl">DAILY GRIND</span></span></Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">{navItems.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${location === item.href ? "nav-link-active" : ""}`}>{item.label}</Link>)}</nav>
        <div className="flex items-center gap-2"><button aria-label={`Open cart, ${itemCount} items`} onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center border border-[#3a2a1e]/25 text-[#3a2a1e] transition hover:border-[#c97b3d] hover:text-[#c97b3d]"><ShoppingBag size={19} aria-hidden="true" />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#c97b3d] px-1 text-[10px] font-bold text-white">{itemCount}</span>}</button><button aria-label={mobileOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileOpen((value) => !value)} className="grid h-10 w-10 place-items-center border border-[#3a2a1e]/25 lg:hidden">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </div>
      {mobileOpen && <nav className="border-t border-[#3a2a1e]/10 bg-[#faf6f1] px-5 py-4 lg:hidden" aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} href={item.href} className={`block border-b border-[#3a2a1e]/10 py-3 text-sm font-bold uppercase tracking-[0.14em] ${location === item.href ? "text-[#c97b3d]" : "text-[#3a2a1e]"}`}>{item.label}</Link>)}</nav>}
    </header>
    <main>{children}</main>
    <footer className="border-t-4 border-double border-[#3a2a1e] bg-[#3a2a1e] px-4 py-12 text-[#faf6f1] sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-9 md:grid-cols-[1.3fr_1fr_1fr]">
      <div><div className="flex items-center gap-3"><img className="h-14 w-14 object-contain" src={assets.logo} alt="" /><span className="font-display text-3xl">Daily Grind</span></div><p className="mt-4 max-w-xs text-sm leading-6 text-[#faf6f1]/70">The neighborhood counter for small-batch coffee, fresh bakes, and a more deliberate daily ritual.</p></div>
      <div><p className="footer-label">Hours</p>{Object.entries(cafe.hours).map(([day, hours]) => <p key={day} className="mt-2 text-sm text-[#faf6f1]/80"><span className="font-semibold text-[#faf6f1]">{day}</span><br />{hours}</p>)}</div>
      <div><p className="footer-label">Find us</p><p className="mt-2 text-sm leading-6 text-[#faf6f1]/80">{cafe.location}<br />{cafe.phone}<br />{cafe.email}</p><div className="mt-5 flex gap-4 text-xs font-bold uppercase tracking-[0.12em]"><a href="#instagram">Instagram</a><a href="#facebook">Facebook</a></div></div>
    </div><p className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-4 text-[11px] uppercase tracking-[0.14em] text-[#faf6f1]/50">© 2026 The Daily Grind · Good coffee, in good company.</p></footer>
    <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    <ChatWidget />
  </div>;
}


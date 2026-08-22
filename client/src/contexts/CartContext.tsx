/**
 * COUNTER JOURNAL DESIGN NOTE: Cart state preserves a guest’s chosen drink
 * ticket and regulars locally, keeping repeat ordering quick and transparent.
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cafe, menu, type MenuItem } from "@/data/cafeData";
import { customizationKey, customizationLabel, customizationPrice, defaultCustomization, type DrinkCustomization } from "@/lib/orderOptions";

export type CartLine = { id: string; itemId: string; quantity: number; customization?: DrinkCustomization };
export type FavoriteDrink = { id: string; itemId: string; customization: DrinkCustomization; createdAt: number };
export type CartItem = { line: CartLine; item: MenuItem; quantity: number; unitPrice: number; lineTotal: number; customizationLabel?: string };
type CartContextValue = { lines: CartLine[]; items: CartItem[]; favorites: FavoriteDrink[]; itemCount: number; subtotal: number; addItem: (itemId: string, customization?: DrinkCustomization) => void; setQuantity: (lineId: string, quantity: number) => void; removeItem: (lineId: string) => void; toggleFavorite: (itemId: string, customization: DrinkCustomization) => void; isFavorite: (itemId: string, customization: DrinkCustomization) => boolean; reorderFavorite: (favorite: FavoriteDrink) => void; removeFavorite: (favoriteId: string) => void; clearCart: () => void; };
const CartContext = createContext<CartContextValue | undefined>(undefined);
const favoritesStorageKey = "daily-grind-favorites";
const lineIdFor = (itemId: string, customization?: DrinkCustomization) => `${itemId}::${customization ? customizationKey(customization) : "standard"}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<FavoriteDrink[]>(() => { try { const stored = localStorage.getItem(favoritesStorageKey); return stored ? JSON.parse(stored) as FavoriteDrink[] : []; } catch { return []; } });
  useEffect(() => { localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites)); }, [favorites]);
  const addItem = (itemId: string, customization?: DrinkCustomization) => { const id = lineIdFor(itemId, customization); setLines((current) => { const existing = current.find((line) => line.id === id); return existing ? current.map((line) => line.id === id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { id, itemId, quantity: 1, customization }]; }); };
  const setQuantity = (lineId: string, quantity: number) => setLines((current) => quantity <= 0 ? current.filter((line) => line.id !== lineId) : current.map((line) => line.id === lineId ? { ...line, quantity } : line));
  const removeItem = (lineId: string) => setLines((current) => current.filter((line) => line.id !== lineId));
  const toggleFavorite = (itemId: string, customization: DrinkCustomization) => { const id = lineIdFor(itemId, customization); setFavorites((current) => current.some((favorite) => favorite.id === id) ? current.filter((favorite) => favorite.id !== id) : [...current, { id, itemId, customization, createdAt: Date.now() }]); };
  const isFavorite = (itemId: string, customization: DrinkCustomization) => favorites.some((favorite) => favorite.id === lineIdFor(itemId, customization));
  const reorderFavorite = (favorite: FavoriteDrink) => addItem(favorite.itemId, favorite.customization);
  const removeFavorite = (favoriteId: string) => setFavorites((current) => current.filter((favorite) => favorite.id !== favoriteId));
  const clearCart = () => setLines([]);
  const value = useMemo(() => { const items = lines.flatMap((line): CartItem[] => { const item = menu.find((entry) => entry.id === line.itemId); if (!item) return []; const unitPrice = item.price + (line.customization ? customizationPrice(line.customization) : 0); return [{ line, item, quantity: line.quantity, unitPrice, lineTotal: unitPrice * line.quantity, customizationLabel: line.customization ? customizationLabel(line.customization) : undefined }]; }); return { lines, favorites, addItem, setQuantity, removeItem, toggleFavorite, isFavorite, reorderFavorite, removeFavorite, clearCart, itemCount: lines.reduce((count, line) => count + line.quantity, 0), subtotal: items.reduce((total, entry) => total + entry.lineTotal, 0), items }; }, [lines, favorites]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }

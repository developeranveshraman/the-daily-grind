/**
 * COUNTER JOURNAL DESIGN NOTE: Data powers an editorial café experience where
 * warm, specific details make ordering and customer service feel personal.
 */
export type MenuCategory = "Coffee" | "Tea" | "Pastries" | "Breakfast" | "Sandwiches";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: string;
  price: number;
  description: string;
  allergens: string[];
  mayContain?: string[];
  tags?: string[];
  notes?: string;
  image: "espresso" | "pastry" | "breakfast" | "hero";
};

export const cafe = {
  name: "The Daily Grind",
  tagline: "Small-batch coffee, baked fresh daily",
  hours: {
    "Monday–Friday": "7:00 AM – 6:00 PM",
    "Saturday–Sunday": "8:00 AM – 4:00 PM",
  },
  location: "123 Main St",
  phone: "(555) 123-4567",
  email: "hello@thedailygrind.cafe",
  deliveryFee: 3.5,
  extraShotPrice: 1.25,
  taxRate: 0.08,
};

export const assets = {
  logo: "/assets/daily-grind-logo.png",
  hero: "/assets/daily-grind-hero.jpg",
  espresso: "/assets/daily-grind-espresso.jpg",
  pastry: "/assets/daily-grind-pastry.jpg",
  breakfast: "/assets/daily-grind-breakfast.jpg",
  glyph: "/assets/daily-grind-glyph.png",
} as const;

export const categories: MenuCategory[] = ["Coffee", "Tea", "Pastries", "Breakfast", "Sandwiches"];

export const menu: MenuItem[] = [
  { id: "espresso", category: "Coffee", name: "Espresso", price: 3, description: "Two focused shots with a dark caramel crema.", allergens: [], tags: ["dairy-free", "vegan"], image: "espresso" },
  { id: "cappuccino", category: "Coffee", name: "Cappuccino", price: 4.25, description: "Espresso, soft milk foam, and just enough quiet.", allergens: ["dairy"], image: "hero" },
  { id: "caramel-latte", category: "Coffee", name: "Caramel Latte", price: 4.75, description: "Velvety espresso with house caramel and steamed milk.", allergens: ["dairy"], image: "breakfast" },
  { id: "cold-brew", category: "Coffee", name: "Cold Brew", price: 4, description: "Steeped slow for a smooth, cocoa-like finish.", allergens: [], tags: ["dairy-free", "vegan"], image: "pastry" },
  { id: "mocha", category: "Coffee", name: "Mocha", price: 5.25, description: "Espresso, dark cocoa, and steamed milk with a clean finish.", allergens: ["dairy"], image: "espresso" },
  { id: "maple-oat-latte", category: "Coffee", name: "Maple Oat Latte", price: 5.5, description: "Espresso and oat milk with a small pour of maple warmth.", allergens: [], tags: ["vegan"], image: "hero" },
  { id: "english-breakfast", category: "Tea", name: "English Breakfast", price: 3.25, description: "A brisk, full-bodied black tea served simply.", allergens: [], tags: ["vegan"], image: "hero" },
  { id: "chamomile", category: "Tea", name: "Chamomile", price: 3.25, description: "Soft floral tea for a slower kind of afternoon.", allergens: [], tags: ["vegan"], image: "hero" },
  { id: "matcha-latte", category: "Tea", name: "Matcha Latte", price: 4.75, description: "Stone-ground matcha whisked smooth with steamed milk.", allergens: ["dairy"], image: "breakfast" },
  { id: "ginger-mint", category: "Tea", name: "Ginger Mint", price: 3.5, description: "A bright herbal steep with ginger spice and clean mint.", allergens: [], tags: ["vegan"], image: "hero" },
  { id: "butter-croissant", category: "Pastries", name: "Butter Croissant", price: 3.75, description: "A flaky, butter-rich classic baked for the morning rush.", allergens: ["gluten", "dairy"], image: "pastry" },
  { id: "blueberry-muffin", category: "Pastries", name: "Blueberry Muffin", price: 3.5, description: "Tender crumb, blueberry pockets, and a crackled top.", allergens: ["gluten", "dairy"], mayContain: ["nuts"], image: "pastry" },
  { id: "almond-biscotti", category: "Pastries", name: "Almond Biscotti", price: 3, description: "Twice-baked and ready for a long coffee break.", allergens: ["gluten", "nuts", "dairy"], image: "pastry" },
  { id: "cinnamon-roll", category: "Pastries", name: "Cinnamon Roll", price: 4.25, description: "Soft spirals of cinnamon sugar with a warm vanilla glaze.", allergens: ["gluten", "dairy"], image: "pastry" },
  { id: "lemon-poppy-loaf", category: "Pastries", name: "Lemon Poppy Loaf", price: 3.75, description: "Bright lemon crumb, poppy seed texture, and a thin citrus glaze.", allergens: ["gluten", "dairy", "eggs"], image: "pastry" },
  { id: "avocado-toast", category: "Breakfast", name: "Avocado Toast", price: 8.5, description: "Smashed avocado, herbs, chili, and feta on toasted sourdough.", allergens: ["gluten"], notes: "vegan without feta add-on", image: "breakfast" },
  { id: "breakfast-burrito", category: "Breakfast", name: "Breakfast Burrito", price: 9, description: "Egg, roasted potato, cheddar, and salsa tucked into a warm wrap.", allergens: ["gluten", "dairy", "eggs"], image: "breakfast" },
  { id: "yogurt-granola", category: "Breakfast", name: "Yogurt & Granola", price: 6.5, description: "Greek yogurt, seasonal fruit, and toasted house granola.", allergens: ["dairy", "gluten", "nuts"], image: "breakfast" },
  { id: "turkey-swiss", category: "Sandwiches", name: "Turkey & Swiss", price: 9.5, description: "Roasted turkey, Swiss, greens, and grain mustard on country bread.", allergens: ["gluten", "dairy"], image: "hero" },
  { id: "caprese", category: "Sandwiches", name: "Caprese", price: 8.75, description: "Tomato, basil, mozzarella, and olive oil on toasted focaccia.", allergens: ["gluten", "dairy"], tags: ["vegetarian"], image: "hero" },
  { id: "roasted-veggie", category: "Sandwiches", name: "Roasted Veggie", price: 9.25, description: "Roasted vegetables, greens, and herbed goat cheese on ciabatta.", allergens: ["gluten", "dairy"], tags: ["vegetarian"], image: "breakfast" },
];

export const imageFor = (item: MenuItem) => assets[item.image];
export const featuredItems = menu.filter((item) => ["cappuccino", "cold-brew", "butter-croissant", "avocado-toast"].includes(item.id));
export const formatPrice = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

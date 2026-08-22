/**
 * COUNTER JOURNAL DESIGN NOTE: Dashboard data stays on-device and uses a
 * believable, deterministic café rhythm to support transparent exploration.
 */
import { menu } from "@/data/cafeData";
export type SaleRow = { date: string; day_of_week: string; time_of_day: number; item_name: string; category: string; quantity_sold: number; unit_price: number; total_revenue: number };
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const seed = (value: number) => { const x = Math.sin(value * 127.1) * 43758.5453; return x - Math.floor(x); };
const choose = <T,>(values: T[], value: number) => values[Math.floor(seed(value) * values.length) % values.length];
const pickItem = (index: number, weekend: boolean) => {
  const coffee = menu.filter((item) => item.category === "Coffee");
  const pastries = menu.filter((item) => item.category === "Pastries");
  const food = menu.filter((item) => item.category === "Breakfast" || item.category === "Sandwiches");
  const tea = menu.filter((item) => item.category === "Tea");
  const bucket = seed(index * 1.5) < (weekend ? 0.43 : 0.54) ? coffee : seed(index * 3.3) < 0.73 ? pastries : seed(index * 4.7) < 0.88 ? food : tea;
  return choose(bucket, index * 2.17);
};
const hourFor = (category: string, index: number) => {
  const hours = category === "Coffee" ? [7, 7, 8, 8, 8, 9, 9, 10, 11, 14] : category === "Pastries" ? [7, 8, 8, 9, 9, 10, 11, 12, 13] : category === "Tea" ? [9, 10, 11, 12, 13, 14, 15] : [9, 10, 11, 12, 12, 13, 14];
  return choose(hours, index * 5.2);
};
export function generateSampleSales(): SaleRow[] {
  const rows: SaleRow[] = []; const today = new Date();
  for (let dayOffset = 34; dayOffset >= 0; dayOffset -= 1) {
    const date = new Date(today); date.setDate(today.getDate() - dayOffset);
    const weekend = date.getDay() === 0 || date.getDay() === 6; const perDay = weekend ? 10 : 6;
    for (let orderIndex = 0; orderIndex < perDay; orderIndex += 1) {
      const index = dayOffset * 13 + orderIndex; const item = pickItem(index, weekend); const quantity = seed(index * 7.31) > 0.78 ? 2 : 1;
      rows.push({ date: date.toISOString().slice(0, 10), day_of_week: weekdays[date.getDay()], time_of_day: hourFor(item.category, index), item_name: item.name, category: item.category, quantity_sold: quantity, unit_price: item.price, total_revenue: Number((item.price * quantity).toFixed(2)) });
    }
  }
  return rows;
}

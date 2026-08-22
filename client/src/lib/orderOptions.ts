/**
 * COUNTER JOURNAL DESIGN NOTE: Drink options read like a clear counter ticket:
 * simple, specific choices and transparent pricing for every variation.
 */
import { cafe } from "@/data/cafeData";

export const milkOptions = ["Whole", "Oat", "Almond", "Soy", "No milk"] as const;
export const sugarOptions = ["No sugar", "Light", "Regular", "Extra sweet"] as const;
export type MilkType = (typeof milkOptions)[number];
export type SugarLevel = (typeof sugarOptions)[number];
export type DrinkCustomization = { milk: MilkType; sugar: SugarLevel; extraShots: number };
export const defaultCustomization: DrinkCustomization = { milk: "Whole", sugar: "Regular", extraShots: 0 };

export const isCustomizableDrink = (category: string) => category === "Coffee" || category === "Tea";
export const customizationKey = (customization: DrinkCustomization) => `${customization.milk}|${customization.sugar}|${customization.extraShots}`;
export const customizationLabel = (customization: DrinkCustomization) => `${customization.milk} milk · ${customization.sugar} sugar${customization.extraShots ? ` · +${customization.extraShots} shot${customization.extraShots === 1 ? "" : "s"}` : ""}`;
export const customizationPrice = (customization: DrinkCustomization) => customization.extraShots * cafe.extraShotPrice;

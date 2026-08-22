/**
 * COUNTER JOURNAL DESIGN NOTE: These tests safeguard the local, dependable
 * service behaviors that power the café prototype without any network access.
 */
import { describe, expect, it } from "vitest";
import { generateSampleSales } from "@/data/analytics";
import { answerQuestion, testQuestions } from "@/utils/chatbot";

describe("offline FAQ assistant", () => {
  it("returns a template response for every supplied test-console question", () => {
    for (const question of testQuestions) {
      const reply = answerQuestion(question);
      expect(reply.text.length).toBeGreaterThan(10);
      expect(reply.intent).toBeTruthy();
    }
  });

  it("uses fuzzy lookup to identify a cappuccino typo and disclose its listed price", () => {
    const reply = answerQuestion("How much is a capuccino?");
    expect(reply.intent).toBe("price");
    expect(reply.text).toContain("Cappuccino is $4.25");
  });

  it("explains the local customization, favorites, tipping, and confirmation flows", () => {
    expect(answerQuestion("Can I use oat milk and an extra shot?").intent).toBe("customization");
    expect(answerQuestion("How do I save a favorite?").intent).toBe("favorites");
    expect(answerQuestion("How does tipping work?").intent).toBe("tips");
    expect(answerQuestion("Where do I review my order?").intent).toBe("checkout");
  });
});

describe("sample sales data", () => {
  it("generates approximately 250 local order records with derived revenue", () => {
    const rows = generateSampleSales();
    expect(rows).toHaveLength(250);
    expect(rows.every((row) => row.total_revenue === Number((row.unit_price * row.quantity_sold).toFixed(2)))).toBe(true);
  });
});

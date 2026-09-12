import { afterEach, describe, expect, it, vi } from "vitest";
import { isWithinNextDays } from "./date";

afterEach(() => vi.useRealTimers());

describe("isWithinNextDays", () => {
  it("treats today and the final day as inclusive", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 12, 12));

    expect(isWithinNextDays("2026-09-12", 7)).toBe(true);
    expect(isWithinNextDays("2026-09-19", 7)).toBe(true);

  });

  it("rejects values outside the window and invalid dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 12, 12));

    expect(isWithinNextDays("2026-09-11", 7)).toBe(false);
    expect(isWithinNextDays("2026-09-20", 7)).toBe(false);
    expect(isWithinNextDays(null, 7)).toBe(false);
    expect(isWithinNextDays("2026-02-30", 7)).toBe(false);

  });
});

import { describe, expect, it } from "vitest";
import {
  PRELOAD_RELOAD_COOLDOWN_MS,
  shouldReloadAfterPreloadError,
} from "./preload-recovery";

describe("preload error recovery", () => {
  it("allows the first stale-chunk reload", () => {
    expect(shouldReloadAfterPreloadError(null, 1_000)).toBe(true);
  });

  it("blocks a reload loop inside the cooldown", () => {
    expect(shouldReloadAfterPreloadError(1_000, 1_001)).toBe(false);
  });

  it("allows recovery again after the cooldown", () => {
    expect(
      shouldReloadAfterPreloadError(
        1_000,
        1_000 + PRELOAD_RELOAD_COOLDOWN_MS,
      ),
    ).toBe(true);
  });
});

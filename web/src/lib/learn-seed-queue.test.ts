import { describe, expect, it } from "vitest";
import {
  createLearnSeedQueue,
  observeLearnSeed,
  restoreLearnSeed,
  takeLearnSeed,
} from "./learn-seed-queue";

describe("learn seed queue", () => {
  it("accepts a seed that arrives after the persistent chat mounts", () => {
    const queue = createLearnSeedQueue(null);

    observeLearnSeed(queue, "build a calendar skill");

    expect(takeLearnSeed(queue)).toBe("build a calendar skill");
    expect(takeLearnSeed(queue)).toBeNull();
  });

  it("restores an unsent seed for the reconnecting socket", () => {
    const queue = createLearnSeedQueue("build a calendar skill");
    const seed = takeLearnSeed(queue);

    expect(seed).toBe("build a calendar skill");
    restoreLearnSeed(queue, seed!);

    expect(takeLearnSeed(queue)).toBe("build a calendar skill");
    expect(takeLearnSeed(queue)).toBeNull();
  });

  it("allows the same seed again after its query parameter is consumed", () => {
    const queue = createLearnSeedQueue("repeatable skill");
    expect(takeLearnSeed(queue)).toBe("repeatable skill");

    observeLearnSeed(queue, null);
    observeLearnSeed(queue, "repeatable skill");

    expect(takeLearnSeed(queue)).toBe("repeatable skill");
  });
});

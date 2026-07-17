export interface LearnSeedQueue {
  observed: string | null;
  pending: string[];
}

export function createLearnSeedQueue(initialSeed: string | null): LearnSeedQueue {
  return {
    observed: initialSeed,
    pending: initialSeed ? [initialSeed] : [],
  };
}

export function observeLearnSeed(
  queue: LearnSeedQueue,
  seed: string | null,
): void {
  if (seed === queue.observed) return;
  queue.observed = seed;
  if (seed) queue.pending.push(seed);
}

export function takeLearnSeed(queue: LearnSeedQueue): string | null {
  return queue.pending.shift() ?? null;
}

export function restoreLearnSeed(queue: LearnSeedQueue, seed: string): void {
  queue.pending.unshift(seed);
}

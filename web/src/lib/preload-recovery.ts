export const PRELOAD_RELOAD_COOLDOWN_MS = 30_000;

export function shouldReloadAfterPreloadError(
  lastReloadAt: number | null,
  now: number,
): boolean {
  return (
    lastReloadAt === null ||
    !Number.isFinite(lastReloadAt) ||
    now - lastReloadAt >= PRELOAD_RELOAD_COOLDOWN_MS
  );
}

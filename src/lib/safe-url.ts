/**
 * Validates a user-supplied URL is safe to render as an href.
 * Only http(s) schemes are allowed — blocks javascript:, data:, vbscript:, etc.
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const { protocol } = new URL(url, window.location.origin);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** Returns the URL if safe, otherwise undefined — handy for href props. */
export function safeHref(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return isSafeUrl(url) ? url : undefined;
}

/**
 * Local/dev switch. When true:
 * - skip IP daily quota
 * - skip login, guest, and credit checks
 *
 * Must be false in production. Cost control depends on it.
 */
export function isDevBypassLimits() {
  const raw = process.env.DEV_BYPASS_LIMITS?.trim().toLowerCase();
  return raw === "true" || raw === "1";
}

/**
 * Traffic-validation period: hide pricing, credits, and account chrome.
 * Turn on later with SHOW_MONETIZATION=true when login/paywall go live.
 */
export function isMonetizationEnabled() {
  const raw = process.env.SHOW_MONETIZATION?.trim().toLowerCase();
  return raw === "true" || raw === "1";
}

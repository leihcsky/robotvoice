/** Per-clip script cap during traffic validation. */
export const VALIDATION_MAX_CHARS = 300;

/** Default free generations per IP per UTC day. Override with VALIDATION_DAILY_IP_LIMIT. */
export const DEFAULT_DAILY_IP_LIMIT = 8;

export const DAILY_LIMIT_MESSAGE =
  "Today's free generations for this network are used. Try again tomorrow.";

export function getDailyIpLimit() {
  const raw = Number(process.env.VALIDATION_DAILY_IP_LIMIT);
  if (Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return DEFAULT_DAILY_IP_LIMIT;
}

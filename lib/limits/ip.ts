const IPV4 =
  /^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const IPV6 =
  /^(?:[0-9a-f]{1,4}:){2,7}[0-9a-f]{1,4}$|^::(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4}$|^[0-9a-f]{1,4}::(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4}$/i;

export function isValidIp(value: string) {
  const ip = value.trim();
  if (!ip || ip === "unknown" || ip === "localhost") return false;
  if (IPV4.test(ip)) return true;
  if (ip.includes(":") && IPV6.test(ip.replace(/^\[|\]$/g, ""))) return true;
  return false;
}

function firstValidIp(value: string | null) {
  if (!value) return null;
  for (const part of value.split(",")) {
    const ip = part.trim().replace(/^\[|\]$/g, "");
    if (isValidIp(ip)) return ip;
  }
  return null;
}

/**
 * Prefer platform-provided headers that clients cannot spoof.
 * x-forwarded-for is last because browsers/scripts can set it.
 */
export function extractClientIp(
  headers: Headers,
  options?: { allowLocalFallback?: boolean },
): string | null {
  const found =
    firstValidIp(headers.get("cf-connecting-ip")) ??
    firstValidIp(headers.get("x-real-ip")) ??
    firstValidIp(headers.get("x-vercel-forwarded-for")) ??
    firstValidIp(headers.get("x-forwarded-for"));

  if (found) return found;
  if (options?.allowLocalFallback) return "127.0.0.1";
  return null;
}

export function utcDayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

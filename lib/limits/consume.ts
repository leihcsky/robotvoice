import { DAILY_LIMIT_MESSAGE, getDailyIpLimit } from "./constants";
import { hashIp } from "./hash";
import { extractClientIp, utcDayKey } from "./ip";
import { prismaDailyUsageStore, type DailyUsageStore } from "./store";

export class DailyLimitError extends Error {
  readonly code = "DAILY_LIMIT";

  constructor(message = DAILY_LIMIT_MESSAGE) {
    super(message);
    this.name = "DailyLimitError";
  }
}

export async function consumeDailyIpQuota(
  headers: Headers,
  options?: {
    store?: DailyUsageStore;
    limit?: number;
    now?: Date;
    secret?: string;
    allowLocalFallback?: boolean;
  },
) {
  const ip = extractClientIp(headers, {
    allowLocalFallback:
      options?.allowLocalFallback ?? process.env.NODE_ENV !== "production",
  });
  if (!ip) {
    throw new DailyLimitError();
  }

  const result = await (options?.store ?? prismaDailyUsageStore).tryConsume(
    hashIp(ip, options?.secret),
    utcDayKey(options?.now),
    options?.limit ?? getDailyIpLimit(),
    ip,
  );

  if (!result.allowed) {
    throw new DailyLimitError();
  }

  return result;
}

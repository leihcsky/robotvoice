import { prisma } from "@/lib/db/prisma";

export interface ConsumeResult {
  allowed: boolean;
  count: number;
}

export interface DailyUsageStore {
  tryConsume(
    ipHash: string,
    day: string,
    limit: number,
    ip?: string,
  ): Promise<ConsumeResult>;
}

export function createMemoryDailyUsageStore(
  seed: Iterable<[string, number]> = [],
): DailyUsageStore {
  const counts = new Map<string, number>(seed);

  return {
    async tryConsume(ipHash, day, limit) {
      const key = `${ipHash}:${day}`;
      const current = counts.get(key) ?? 0;
      if (current >= limit) {
        return { allowed: false, count: current };
      }
      const next = current + 1;
      counts.set(key, next);
      return { allowed: true, count: next };
    },
  };
}

export const prismaDailyUsageStore: DailyUsageStore = {
  async tryConsume(ipHash, day, limit, ip) {
    const bumped = await prisma.$executeRaw`
      UPDATE daily_ip_usage
      SET count = count + 1,
          updated_at = NOW(),
          ip = COALESCE(ip, ${ip ?? null})
      WHERE ip_hash = ${ipHash} AND day = ${day} AND count < ${limit}
    `;
    if (bumped === 1) {
      return { allowed: true, count: await readCount(ipHash, day) };
    }

    const inserted = await prisma.$executeRaw`
      INSERT IGNORE INTO daily_ip_usage (ip_hash, day, ip, count, updated_at)
      VALUES (${ipHash}, ${day}, ${ip ?? null}, 1, NOW())
    `;
    if (inserted === 1) {
      return { allowed: true, count: 1 };
    }

    const retried = await prisma.$executeRaw`
      UPDATE daily_ip_usage
      SET count = count + 1,
          updated_at = NOW(),
          ip = COALESCE(ip, ${ip ?? null})
      WHERE ip_hash = ${ipHash} AND day = ${day} AND count < ${limit}
    `;
    if (retried === 1) {
      return { allowed: true, count: await readCount(ipHash, day) };
    }

    return { allowed: false, count: await readCount(ipHash, day, limit) };
  },
};

async function readCount(ipHash: string, day: string, fallback = 0) {
  const rows = await prisma.$queryRaw<Array<{ count: number | bigint }>>`
    SELECT count FROM daily_ip_usage
    WHERE ip_hash = ${ipHash} AND day = ${day}
  `;
  const value = rows[0]?.count;
  if (typeof value === "bigint") return Number(value);
  return value ?? fallback;
}

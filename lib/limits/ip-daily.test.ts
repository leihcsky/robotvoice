import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { consumeDailyIpQuota, DailyLimitError } from "./consume";
import { hashIp } from "./hash";
import { extractClientIp, isValidIp, utcDayKey } from "./ip";
import { createMemoryDailyUsageStore } from "./store";

describe("extractClientIp", () => {
  it("prefers Cloudflare over a spoofed x-forwarded-for", () => {
    const headers = new Headers({
      "cf-connecting-ip": "203.0.113.10",
      "x-forwarded-for": "198.51.100.1, 203.0.113.10",
    });
    assert.equal(extractClientIp(headers), "203.0.113.10");
  });

  it("uses the first valid x-forwarded-for hop when no platform header exists", () => {
    const headers = new Headers({
      "x-forwarded-for": "198.51.100.9, 10.0.0.1",
    });
    assert.equal(extractClientIp(headers), "198.51.100.9");
  });

  it("rejects missing or junk values", () => {
    assert.equal(extractClientIp(new Headers()), null);
    assert.equal(extractClientIp(new Headers({ "x-forwarded-for": "unknown" })), null);
    assert.equal(isValidIp("not-an-ip"), false);
  });

  it("can fall back to loopback for local servers", () => {
    assert.equal(
      extractClientIp(new Headers(), { allowLocalFallback: true }),
      "127.0.0.1",
    );
  });
});

describe("utcDayKey", () => {
  it("uses UTC calendar date", () => {
    assert.equal(utcDayKey(new Date("2026-09-08T01:00:00.000Z")), "2026-09-08");
    assert.equal(utcDayKey(new Date("2026-09-08T23:59:59.000Z")), "2026-09-08");
    assert.equal(utcDayKey(new Date("2026-09-09T00:00:00.000Z")), "2026-09-09");
  });
});

describe("hashIp", () => {
  it("is stable for the same IP and secret", () => {
    assert.equal(hashIp("203.0.113.10", "secret"), hashIp("203.0.113.10", "secret"));
  });

  it("changes when the IP or secret changes", () => {
    const a = hashIp("203.0.113.10", "secret");
    assert.notEqual(a, hashIp("203.0.113.11", "secret"));
    assert.notEqual(a, hashIp("203.0.113.10", "other"));
    assert.equal(a.includes("203.0.113.10"), false);
    assert.equal(a.length, 64);
  });
});

describe("consumeDailyIpQuota", () => {
  const now = new Date("2026-09-08T12:00:00.000Z");
  const secret = "test-secret";

  function headersFor(ip: string) {
    return new Headers({ "cf-connecting-ip": ip });
  }

  it("allows up to the limit then blocks without incrementing past it", async () => {
    const store = createMemoryDailyUsageStore();
    const ip = "203.0.113.40";

    for (let i = 1; i <= 8; i++) {
      const result = await consumeDailyIpQuota(headersFor(ip), {
        store,
        limit: 8,
        now,
        secret,
      });
      assert.equal(result.allowed, true);
      assert.equal(result.count, i);
    }

    await assert.rejects(
      () =>
        consumeDailyIpQuota(headersFor(ip), {
          store,
          limit: 8,
          now,
          secret,
        }),
      (error: unknown) => {
        assert.ok(error instanceof DailyLimitError);
        assert.equal(error.code, "DAILY_LIMIT");
        return true;
      },
    );

    const blocked = await store.tryConsume(
      hashIp(ip, secret),
      utcDayKey(now),
      8,
    );
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.count, 8);
  });

  it("isolates quotas by IP and by UTC day", async () => {
    const store = createMemoryDailyUsageStore();

    await consumeDailyIpQuota(headersFor("203.0.113.1"), {
      store,
      limit: 1,
      now,
      secret,
    });

    await assert.rejects(
      () =>
        consumeDailyIpQuota(headersFor("203.0.113.1"), {
          store,
          limit: 1,
          now,
          secret,
        }),
      DailyLimitError,
    );

    const otherIp = await consumeDailyIpQuota(headersFor("203.0.113.2"), {
      store,
      limit: 1,
      now,
      secret,
    });
    assert.equal(otherIp.count, 1);

    const nextDay = await consumeDailyIpQuota(headersFor("203.0.113.1"), {
      store,
      limit: 1,
      now: new Date("2026-09-09T00:00:00.000Z"),
      secret,
    });
    assert.equal(nextDay.count, 1);
  });

  it("fails closed when the client IP is missing", async () => {
    await assert.rejects(
      () =>
        consumeDailyIpQuota(new Headers(), {
          store: createMemoryDailyUsageStore(),
          limit: 8,
          now,
          secret,
          allowLocalFallback: false,
        }),
      DailyLimitError,
    );
  });
});

import { hashIp } from "../lib/limits/hash";
import { utcDayKey } from "../lib/limits/ip";
import { prismaDailyUsageStore } from "../lib/limits/store";
import { prisma } from "../lib/db/prisma";

const LIMIT = 8;
const DAY = utcDayKey(new Date("2099-01-01T00:00:00.000Z"));

async function deleteOne(ipHash: string) {
  await prisma.$executeRaw`
    DELETE FROM daily_ip_usage WHERE day = ${DAY} AND ip_hash = ${ipHash}
  `;
}

async function readCount(ipHash: string) {
  const rows = await prisma.$queryRaw<Array<{ count: number | bigint }>>`
    SELECT count FROM daily_ip_usage
    WHERE ip_hash = ${ipHash} AND day = ${DAY}
  `;
  const value = rows[0]?.count;
  return typeof value === "bigint" ? Number(value) : (value ?? 0);
}

async function readIp(ipHash: string) {
  const rows = await prisma.$queryRaw<Array<{ ip: string | null }>>`
    SELECT ip FROM daily_ip_usage
    WHERE ip_hash = ${ipHash} AND day = ${DAY}
  `;
  return rows[0]?.ip ?? null;
}

async function run() {
  const ipA = "198.51.100.80";
  const ipB = "198.51.100.81";
  const ipHashA = hashIp(ipA, "ip-limit-test");
  const ipHashB = hashIp(ipB, "ip-limit-test");

  await deleteOne(ipHashA);
  await deleteOne(ipHashB);

  const sequential: boolean[] = [];
  for (let i = 0; i < LIMIT + 2; i++) {
    const result = await prismaDailyUsageStore.tryConsume(
      ipHashA,
      DAY,
      LIMIT,
      ipA,
    );
    sequential.push(result.allowed);
  }

  const allowedSeq = sequential.filter(Boolean).length;
  const deniedSeq = sequential.length - allowedSeq;
  const countA = await readCount(ipHashA);
  const storedIpA = await readIp(ipHashA);

  if (allowedSeq !== LIMIT || deniedSeq !== 2 || countA !== LIMIT) {
    throw new Error(
      `sequential: expected ${LIMIT} allowed / 2 denied / count=${LIMIT}, got allowed=${allowedSeq} denied=${deniedSeq} count=${countA}`,
    );
  }
  if (storedIpA !== ipA) {
    throw new Error(`expected stored ip ${ipA}, got ${storedIpA}`);
  }

  await deleteOne(ipHashB);

  const parallel = await Promise.all(
    Array.from({ length: 20 }, () =>
      prismaDailyUsageStore.tryConsume(ipHashB, DAY, LIMIT, ipB),
    ),
  );
  const allowedPar = parallel.filter((row) => row.allowed).length;
  const countB = await readCount(ipHashB);
  const storedIpB = await readIp(ipHashB);

  if (allowedPar !== LIMIT || countB !== LIMIT) {
    throw new Error(
      `parallel: expected ${LIMIT} allowed and count=${LIMIT}, got allowed=${allowedPar} count=${countB}`,
    );
  }
  if (storedIpB !== ipB) {
    throw new Error(`expected stored ip ${ipB}, got ${storedIpB}`);
  }

  await deleteOne(ipHashA);
  await deleteOne(ipHashB);

  console.log(
    `IP daily limit OK. sequential ${allowedSeq}/${LIMIT}, parallel ${allowedPar}/${LIMIT}, table never exceeded the cap.`,
  );
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

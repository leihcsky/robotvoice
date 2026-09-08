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

async function run() {
  const ipHashA = hashIp("198.51.100.80", "ip-limit-test");
  const ipHashB = hashIp("198.51.100.81", "ip-limit-test");

  await deleteOne(ipHashA);
  await deleteOne(ipHashB);

  const sequential: boolean[] = [];
  for (let i = 0; i < LIMIT + 2; i++) {
    const result = await prismaDailyUsageStore.tryConsume(ipHashA, DAY, LIMIT);
    sequential.push(result.allowed);
  }

  const allowedSeq = sequential.filter(Boolean).length;
  const deniedSeq = sequential.length - allowedSeq;
  const countA = await readCount(ipHashA);

  if (allowedSeq !== LIMIT || deniedSeq !== 2 || countA !== LIMIT) {
    throw new Error(
      `sequential: expected ${LIMIT} allowed / 2 denied / count=${LIMIT}, got allowed=${allowedSeq} denied=${deniedSeq} count=${countA}`,
    );
  }

  await deleteOne(ipHashB);

  const parallel = await Promise.all(
    Array.from({ length: 20 }, () =>
      prismaDailyUsageStore.tryConsume(ipHashB, DAY, LIMIT),
    ),
  );
  const allowedPar = parallel.filter((row) => row.allowed).length;
  const countB = await readCount(ipHashB);

  if (allowedPar !== LIMIT || countB !== LIMIT) {
    throw new Error(
      `parallel: expected ${LIMIT} allowed and count=${LIMIT}, got allowed=${allowedPar} count=${countB}`,
    );
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

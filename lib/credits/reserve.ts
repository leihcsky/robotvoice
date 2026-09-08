import { CreditTransactionType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { FREE_SIGNUP_CREDITS } from "./calculate";

export class InsufficientCreditsError extends Error {
  constructor(public readonly required: number, public readonly balance: number) {
    super(`Not enough credits: need ${required}, have ${balance}`);
    this.name = "InsufficientCreditsError";
  }
}

export async function getCreditBalance(userId: string): Promise<number> {
  const row = await prisma.creditBalance.findUnique({
    where: { userId },
  });
  return row?.balance ?? 0;
}

export async function grantSignupCredits(userId: string) {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.creditBalance.findUnique({ where: { userId } });
    if (existing) return;

    await tx.creditBalance.create({
      data: { userId, balance: FREE_SIGNUP_CREDITS },
    });
    await tx.creditTransaction.create({
      data: {
        userId,
        amount: FREE_SIGNUP_CREDITS,
        type: CreditTransactionType.SUBSCRIPTION_GRANT,
        description: "Free plan signup grant",
      },
    });
  });
}

export async function reserveCredits(
  userId: string,
  amount: number,
  generationId: string,
) {
  await prisma.$transaction(async (tx) => {
    const balance = await tx.creditBalance.findUnique({ where: { userId } });
    const current = balance?.balance ?? 0;

    if (current < amount) {
      throw new InsufficientCreditsError(amount, current);
    }

    if (!balance) {
      throw new InsufficientCreditsError(amount, 0);
    }

    await tx.creditBalance.update({
      where: { userId },
      data: { balance: { decrement: amount } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: CreditTransactionType.GENERATION_RESERVE,
        referenceId: generationId,
        description: `Reserved ${amount} credits for generation`,
      },
    });
  });
}

export async function commitCredits(
  userId: string,
  amount: number,
  generationId: string,
) {
  await prisma.creditTransaction.create({
    data: {
      userId,
      amount: 0,
      type: CreditTransactionType.GENERATION,
      referenceId: generationId,
      description: `Committed ${amount} credits`,
    },
  });
}

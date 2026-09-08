import { CreditTransactionType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function refundCredits(
  userId: string,
  amount: number,
  generationId: string,
) {
  await prisma.$transaction(async (tx) => {
    const alreadyRefunded = await tx.creditTransaction.findFirst({
      where: {
        userId,
        referenceId: generationId,
        type: CreditTransactionType.GENERATION_REFUND,
      },
    });

    if (alreadyRefunded) return;

    await tx.creditBalance.upsert({
      where: { userId },
      update: { balance: { increment: amount } },
      create: { userId, balance: amount },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type: CreditTransactionType.GENERATION_REFUND,
        referenceId: generationId,
        description: `Refunded ${amount} credits after failed generation`,
      },
    });
  });
}

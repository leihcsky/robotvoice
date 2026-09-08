import { GenerationStatus, type Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(data: { email: string; name?: string | null }) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
    },
  });
}

export async function createGeneration(data: {
  userId?: string | null;
  guestSessionId?: string | null;
  text: string;
  voiceId: string;
  preset: string;
  format: string;
  creditsUsed: number;
}) {
  return prisma.generation.create({
    data: {
      userId: data.userId ?? null,
      guestSessionId: data.guestSessionId ?? null,
      text: data.text,
      textLength: data.text.length,
      voiceId: data.voiceId,
      preset: data.preset,
      format: data.format,
      creditsUsed: data.creditsUsed,
      provider: "replicate",
      status: GenerationStatus.PROCESSING,
    },
  });
}

export async function completeGeneration(
  id: string,
  data: {
    outputStorageKey: string;
    inputStorageKey?: string | null;
    duration?: number | null;
    providerRequestId?: string | null;
    providerCharacters?: number | null;
    processingTimeMs?: number | null;
  },
) {
  return prisma.generation.update({
    where: { id },
    data: {
      status: GenerationStatus.COMPLETED,
      outputStorageKey: data.outputStorageKey,
      inputStorageKey: data.inputStorageKey ?? undefined,
      duration: data.duration ?? undefined,
      providerRequestId: data.providerRequestId ?? undefined,
      providerCharacters: data.providerCharacters ?? undefined,
      processingTimeMs: data.processingTimeMs ?? undefined,
      completedAt: new Date(),
      errorMessage: null,
    },
  });
}

export async function failGeneration(id: string, error: unknown) {
  const message =
    error instanceof Error ? error.message.slice(0, 1000) : "Generation failed";

  return prisma.generation.update({
    where: { id },
    data: {
      status: GenerationStatus.FAILED,
      errorMessage: message,
      completedAt: new Date(),
    },
  });
}

export async function getGenerationById(id: string) {
  return prisma.generation.findUnique({ where: { id } });
}

export async function listGenerations(params: {
  userId?: string;
  guestSessionId?: string;
  take?: number;
}) {
  const where: Prisma.GenerationWhereInput = {};
  if (params.userId) where.userId = params.userId;
  if (params.guestSessionId) where.guestSessionId = params.guestSessionId;

  return prisma.generation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: params.take ?? 50,
  });
}

export async function countGuestGenerations(guestSessionId: string) {
  return prisma.generation.count({
    where: {
      guestSessionId,
      status: {
        in: [
          GenerationStatus.PENDING,
          GenerationStatus.PROCESSING,
          GenerationStatus.COMPLETED,
        ],
      },
    },
  });
}

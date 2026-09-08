import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getGuestSessionId } from "@/lib/auth";
import {
  calculateCredits,
  commitCredits,
  GUEST_GENERATION_LIMIT,
  InsufficientCreditsError,
  refundCredits,
  reserveCredits,
} from "@/lib/credits";
import {
  completeGeneration,
  countGuestGenerations,
  createGeneration,
  failGeneration,
} from "@/lib/db/queries";
import { runProcessJob } from "@/lib/jobs/run-process";
import { consumeDailyIpQuota, DailyLimitError } from "@/lib/limits";
import { createDownloadUrl } from "@/lib/storage/r2";
import { isDevBypassLimits, isMonetizationEnabled } from "@/lib/flags";
import { generateRequestSchema } from "@/lib/validations";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let reserved:
    | { userId: string; credits: number; generationId: string }
    | null = null;
  let generationId: string | null = null;

  try {
    const body = generateRequestSchema().parse(await req.json());
    const bypass = isDevBypassLimits();
    const monetization = isMonetizationEnabled();

    if (!bypass) {
      await consumeDailyIpQuota(req.headers);
    }

    const user = bypass || !monetization ? null : await getCurrentUser();
    const guestSessionId =
      user || bypass || !monetization ? null : await getGuestSessionId();
    const credits = calculateCredits(body.text);

    if (!bypass && monetization && !user && guestSessionId) {
      const used = await countGuestGenerations(guestSessionId);
      if (used >= GUEST_GENERATION_LIMIT) {
        return NextResponse.json(
          { error: "Sign in to continue generating", code: "GUEST_LIMIT" },
          { status: 401 },
        );
      }
    }

    const generation = await createGeneration({
      userId: user?.id,
      guestSessionId,
      text: body.text,
      voiceId: body.voiceId,
      preset: body.preset,
      format: body.format,
      creditsUsed: bypass || !user ? 0 : credits,
    });
    generationId = generation.id;

    if (!bypass && monetization && user) {
      await reserveCredits(user.id, credits, generation.id);
      reserved = { userId: user.id, credits, generationId: generation.id };
    }

    const result = await runProcessJob({
      generationId: generation.id,
      userId: user?.id ?? (bypass ? "dev" : `guest_${guestSessionId ?? "anon"}`),
      text: body.text,
      voiceId: body.voiceId,
      preset: body.preset,
      format: body.format,
      controls: {
        intensity: body.intensity,
        speed: body.speed,
        pitch: body.pitch,
      },
    });

    await completeGeneration(generation.id, result);

    if (reserved) {
      await commitCredits(reserved.userId, reserved.credits, reserved.generationId);
    }

    const audioUrl = await createDownloadUrl(result.outputStorageKey);

    return NextResponse.json({
      generationId: generation.id,
      audioUrl,
      duration: result.duration,
      characters: body.text.length,
      creditsUsed: bypass || !user ? 0 : credits,
    });
  } catch (error) {
    if (reserved) {
      await refundCredits(reserved.userId, reserved.credits, reserved.generationId);
    }
    if (generationId) {
      await failGeneration(generationId, error);
    }

    if (error instanceof DailyLimitError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 429 },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.flatten() },
        { status: 400 },
      );
    }

    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        {
          error: error.message,
          required: error.required,
          balance: error.balance,
        },
        { status: 402 },
      );
    }

    console.error("Generation failed", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

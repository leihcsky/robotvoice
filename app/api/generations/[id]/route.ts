import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getGuestSessionId } from "@/lib/auth";
import { getGenerationById } from "@/lib/db/queries";
import { isDevBypassLimits } from "@/lib/flags";
import { createDownloadUrl } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const generation = await getGenerationById(id);

  if (!generation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const user = isDevBypassLimits() ? null : await getCurrentUser();
  const guestSessionId = user ? null : await getGuestSessionId();
  const allowed =
    isDevBypassLimits() ||
    (user && generation.userId === user.id) ||
    (!user && generation.guestSessionId === guestSessionId);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const audioUrl =
    generation.status === "COMPLETED" && generation.outputStorageKey
      ? await createDownloadUrl(generation.outputStorageKey)
      : null;

  return NextResponse.json({
    id: generation.id,
    text: generation.text,
    preset: generation.preset,
    voiceId: generation.voiceId,
    status: generation.status,
    duration: generation.duration,
    format: generation.format,
    creditsUsed: generation.creditsUsed,
    characters: generation.textLength,
    providerCharacters: generation.providerCharacters,
    processingTimeMs: generation.processingTimeMs,
    audioUrl,
    createdAt: generation.createdAt,
    completedAt: generation.completedAt,
    errorMessage: generation.errorMessage,
  });
}

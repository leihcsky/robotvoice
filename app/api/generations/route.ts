import { NextResponse } from "next/server";
import { getCurrentUser, getGuestSessionId } from "@/lib/auth";
import { listGenerations } from "@/lib/db/queries";
import { isDevBypassLimits } from "@/lib/flags";
import { createDownloadUrl } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function GET() {
  const bypass = isDevBypassLimits();
  const user = bypass ? null : await getCurrentUser();
  const guestSessionId = user || bypass ? undefined : await getGuestSessionId();

  const rows = await listGenerations({
    userId: user?.id,
    guestSessionId,
  });

  const generations = await Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      text: row.text,
      preset: row.preset,
      voiceId: row.voiceId,
      status: row.status,
      duration: row.duration,
      creditsUsed: row.creditsUsed,
      createdAt: row.createdAt,
      audioUrl:
        row.status === "COMPLETED" && row.outputStorageKey
          ? await createDownloadUrl(row.outputStorageKey)
          : null,
    })),
  );

  return NextResponse.json({ generations });
}

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { getLocalStoragePath } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ key: string[] }> },
) {
  const { key } = await context.params;
  const storageKey = key.join("/");

  try {
    const filePath = getLocalStoragePath(storageKey);
    const body = await readFile(filePath);
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename="robot-voice.mp3"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyCreemWebhook } from "@/lib/payments/creem";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("creem-signature") ?? "";
  const payload = await req.text();

  try {
    const valid = verifyCreemWebhook(payload, signature);
    if (!valid) {
      return NextResponse.json(
        { received: true, handled: false },
        { status: 202 },
      );
    }
  } catch {
    return NextResponse.json(
      { received: true, handled: false },
      { status: 202 },
    );
  }

  return NextResponse.json({ received: true });
}

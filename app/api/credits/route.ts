import { NextResponse } from "next/server";
import { getCurrentUser, getGuestSessionId } from "@/lib/auth";
import { GUEST_GENERATION_LIMIT, getCreditBalance } from "@/lib/credits";
import { countGuestGenerations } from "@/lib/db/queries";
import { isDevBypassLimits } from "@/lib/flags";

export const runtime = "nodejs";

export async function GET() {
  if (isDevBypassLimits()) {
    return NextResponse.json({
      authenticated: false,
      bypass: true,
      balance: null,
      guestRemaining: null,
    });
  }

  const user = await getCurrentUser();

  if (user) {
    const balance = await getCreditBalance(user.id);
    return NextResponse.json({
      authenticated: true,
      bypass: false,
      balance,
      guestRemaining: 0,
    });
  }

  const guestSessionId = await getGuestSessionId();
  const used = await countGuestGenerations(guestSessionId);

  return NextResponse.json({
    authenticated: false,
    bypass: false,
    balance: 0,
    guestRemaining: Math.max(0, GUEST_GENERATION_LIMIT - used),
  });
}

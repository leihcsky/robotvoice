import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json({
    received: true,
    handled: false,
    note: "MVP waits synchronously for the worker HTTP response",
  });
}

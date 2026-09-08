export interface CreemCheckoutInput {
  userId: string;
  plan: "CREATOR" | "PRO" | "CREDITS_10K";
}

export async function createCreemCheckout(_input: CreemCheckoutInput) {
  if (!process.env.CREEM_API_KEY) {
    throw new Error("Creem payment is not configured");
  }

  throw new Error("Creem checkout is not implemented in MVP");
}

export function verifyCreemWebhook(_payload: string, _signature: string) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("CREEM_WEBHOOK_SECRET is not set");
  }

  return false;
}

export const CHARS_PER_CREDIT = 100;
export const FREE_SIGNUP_CREDITS = 500;
export const GUEST_GENERATION_LIMIT = 3;

export function calculateCredits(text: string): number {
  return Math.max(1, Math.ceil(text.length / CHARS_PER_CREDIT));
}

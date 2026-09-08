import { createHash } from "node:crypto";

export function hashIp(ip: string, secret = getIpHashSecret()) {
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

function getIpHashSecret() {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "dev-ip-hash-secret"
  );
}

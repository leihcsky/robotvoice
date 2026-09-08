import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_ROOT = path.join(process.cwd(), "tmp", "storage");

function envFilled(name: string) {
  return Boolean(process.env[name]?.trim());
}

function hasR2Config() {
  return (
    envFilled("R2_ACCOUNT_ID") &&
    envFilled("R2_ACCESS_KEY_ID") &&
    envFilled("R2_SECRET_ACCESS_KEY") &&
    envFilled("R2_BUCKET")
  );
}

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID!.trim()}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!.trim(),
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!.trim(),
    },
  });
}

function getR2Bucket() {
  return process.env.R2_BUCKET!.trim();
}

function getPublicBaseUrl() {
  const raw =
    process.env.R2_PUBLIC_BASE_URL?.trim() ||
    process.env.R2_PUBLIC_DOMAIN?.trim();
  if (!raw) return null;
  const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

function publicObjectUrl(storageKey: string, base: string) {
  const objectPath = storageKey
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  return `${base}/${objectPath}`;
}

export function buildOutputStorageKey(userId: string, generationId: string) {
  return `audio/users/${userId}/generations/${generationId}/output.mp3`;
}

export async function uploadToR2({
  userId,
  generationId,
  filePath,
}: {
  userId: string;
  generationId: string;
  filePath: string;
}): Promise<string> {
  const key = buildOutputStorageKey(userId, generationId);
  const body = await readFile(filePath);

  if (!hasR2Config()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET.",
      );
    }
    const dest = path.join(LOCAL_ROOT, key);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, body);
    return key;
  }

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: body,
      ContentType: "audio/mpeg",
    }),
  );

  return key;
}

export async function createDownloadUrl(
  storageKey: string,
  expiresIn = 3600,
): Promise<string> {
  if (!hasR2Config()) {
    return `/api/files/${storageKey}`;
  }

  const publicBase = getPublicBaseUrl();
  if (publicBase) {
    return publicObjectUrl(storageKey, publicBase);
  }

  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: getR2Bucket(),
      Key: storageKey,
    }),
    { expiresIn },
  );
}

export function getLocalStoragePath(storageKey: string) {
  const resolved = path.resolve(LOCAL_ROOT, storageKey);
  if (!resolved.startsWith(path.resolve(LOCAL_ROOT))) {
    throw new Error("Invalid storage key");
  }
  return resolved;
}

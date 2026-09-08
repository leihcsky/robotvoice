import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_ROOT = path.join(process.cwd(), "tmp", "storage");

function hasR2Config() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
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
    const dest = path.join(LOCAL_ROOT, key);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, body);
    return key;
  }

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
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

  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
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

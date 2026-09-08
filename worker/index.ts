import { createServer } from "node:http";
import { processRobotJob } from "./processor";
import type { ProcessJobInput } from "@/lib/jobs/types";

const port = Number(process.env.WORKER_PORT ?? 3001);
const secret = process.env.WORKER_SECRET ?? "";

const server = createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/process") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const auth = req.headers.authorization ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  try {
    const body = await readJson(req);
    const result = await processRobotJob(body as ProcessJobInput);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Worker failed";
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: message }));
  }
});

function readJson(req: import("node:http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

server.listen(port, () => {
  console.log(`Robot voice worker listening on :${port}`);
});

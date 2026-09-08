import type { ProcessJobInput, ProcessJobResult } from "./types";

export async function runProcessJob(
  input: ProcessJobInput,
): Promise<ProcessJobResult> {
  const workerUrl = process.env.WORKER_URL;

  if (workerUrl) {
    const response = await fetch(`${workerUrl.replace(/\/$/, "")}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WORKER_SECRET ?? ""}`,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(payload?.error || `Worker failed (${response.status})`);
    }

    return (await response.json()) as ProcessJobResult;
  }

  const { processRobotJob } = await import("@/worker/processor");
  return processRobotJob(input);
}

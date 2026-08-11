import { randomUUID } from "node:crypto";
import {
  createDocumentSchema,
  tenantContextSchema,
} from "@documents/contracts";
import { Hono } from "hono";
import type { Context, Next } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { DocumentError, DocumentService } from "./document-service.js";
type Vars = { tenantId: string; actorId: string; correlationId: string };
export function createApp(service = new DocumentService()) {
  const app = new Hono<{ Variables: Vars }>();
  app.onError((error, c) => {
    const status = (
      error instanceof DocumentError ? error.status : 500
    ) as ContentfulStatusCode;
    const code = error instanceof DocumentError ? error.code : "INTERNAL_ERROR";
    return c.json(
      {
        code,
        message: code,
        correlationId: c.get("correlationId") ?? "unknown",
      },
      status,
    );
  });
  app.get("/health", (c) => c.json({ status: "ok" }));
  app.use("/v1/*", auth);
  app.get("/v1/documents", (c) =>
    c.json({ items: service.list(c.get("tenantId")) }),
  );
  app.post("/v1/documents", async (c) => {
    const key = c.req.header("idempotency-key");
    if (!key) return c.json({ code: "IDEMPOTENCY_KEY_REQUIRED" }, 422);
    const parsed = createDocumentSchema.safeParse(
      await c.req.json().catch(() => null),
    );
    if (!parsed.success)
      return c.json(
        { code: "VALIDATION_ERROR", details: parsed.error.flatten() },
        422,
      );
    return c.json(service.create(c.get("tenantId"), parsed.data, key), 201);
  });
  app.post("/v1/documents/:id/complete", async (c) => {
    const body = (await c.req.json()) as { checksum: string };
    return c.json(
      service.complete(c.get("tenantId"), c.req.param("id")!, body.checksum),
    );
  });
  return app;
}
async function auth(c: Context<{ Variables: Vars }>, next: Next) {
  const correlationId = c.req.header("x-correlation-id") ?? randomUUID();
  const parsed = tenantContextSchema.safeParse({
    tenantId: c.req.header("x-tenant-id"),
    actorId: c.req.header("x-actor-id"),
    apiKey: c.req.header("x-api-key"),
    correlationId,
  });
  if (!parsed.success)
    return c.json({ code: "UNAUTHENTICATED", correlationId }, 401);
  c.set("tenantId", parsed.data.tenantId);
  c.set("actorId", parsed.data.actorId);
  c.set("correlationId", correlationId);
  c.header("x-correlation-id", correlationId);
  await next();
}

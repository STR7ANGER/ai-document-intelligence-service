import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { DocumentService } from "../src/document-service.js";
const headers = {
  "content-type": "application/json",
  "x-tenant-id": "tenant-a",
  "x-actor-id": "user-1",
  "x-api-key": "1234567890abcdef",
  "idempotency-key": "upload-1",
};
const input = {
  fileName: "contract.pdf",
  mediaType: "application/pdf",
  bytes: 100,
  checksum: "a".repeat(64),
};
test("creates signed upload idempotently and queues parse job", async () => {
  const service = new DocumentService(),
    app = createApp(service);
  const first = await app.request("/v1/documents", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });
  const created = (await first.json()) as {
    document: { id: string };
    upload: { expiresInSeconds: number };
  };
  assert.equal(first.status, 201);
  assert.equal(created.upload.expiresInSeconds, 900);
  const duplicate = (await (
    await app.request("/v1/documents", {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    })
  ).json()) as typeof created;
  assert.equal(duplicate.document.id, created.document.id);
  assert.equal(
    (
      await app.request(`/v1/documents/${created.document.id}/complete`, {
        method: "POST",
        headers,
        body: JSON.stringify({ checksum: input.checksum }),
      })
    ).status,
    200,
  );
  assert.equal(service.jobs.length, 1);
});
test("isolates tenants and validates uploads", async () => {
  const app = createApp();
  assert.equal((await app.request("/v1/documents")).status, 401);
  const invalid = await app.request("/v1/documents", {
    method: "POST",
    headers,
    body: JSON.stringify({ ...input, mediaType: "application/zip" }),
  });
  assert.equal(invalid.status, 422);
});

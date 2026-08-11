import assert from "node:assert/strict";
import test from "node:test";
import { createDocumentSchema } from "./index.js";
test("accepts supported bounded uploads", () =>
  assert.equal(
    createDocumentSchema.safeParse({
      fileName: "contract.pdf",
      mediaType: "application/pdf",
      bytes: 10,
      checksum: "a".repeat(64),
    }).success,
    true,
  ));
test("rejects executables and oversized uploads", () =>
  assert.equal(
    createDocumentSchema.safeParse({
      fileName: "x.exe",
      mediaType: "application/octet-stream",
      bytes: 30_000_000,
      checksum: "x",
    }).success,
    false,
  ));

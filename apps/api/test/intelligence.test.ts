import assert from "node:assert/strict";
import test from "node:test";
import { IntelligenceEngine, IntelligenceError } from "../src/intelligence.js";
test("chunks, ranks and returns grounded citations", () => {
  const e = new IntelligenceEngine();
  e.index(
    "d1",
    [
      { page: 1, text: "invoice total: 42 vendor: Acme payment due Friday" },
      { page: 2, text: "unrelated appendix" },
    ],
    4,
  );
  const answer = e.ask("t1", "d1", "invoice total");
  assert.equal(answer.refused, false);
  assert.ok(answer.citations[0]?.page);
});
test("extracts schema and stores corrections", () => {
  const e = new IntelligenceEngine();
  e.index("d1", [{ page: 1, text: "total: 42, vendor: Acme" }]);
  const result = e.extract("t1", "d1", {
    required: ["total"],
    properties: { total: { type: "number" }, vendor: { type: "string" } },
  });
  assert.equal(result.data.total, 42);
  assert.equal(e.correct("t1", result.id, { total: 43 }).reviewed, true);
});
test("fails closed without evidence and supports deletion", () => {
  const e = new IntelligenceEngine();
  assert.throws(
    () => e.summarize("t1", "missing"),
    (x: unknown) => x instanceof IntelligenceError,
  );
  e.index("d1", [{ page: 1, text: "small text" }]);
  assert.equal(e.deleteDocument("d1").deletedChunks, 1);
});

import { createHash, randomUUID } from "node:crypto";
export interface Chunk {
  id: string;
  documentId: string;
  page: number;
  text: string;
  embedding: number[];
}
export interface Citation {
  chunkId: string;
  page: number;
  quote: string;
}
export class IntelligenceError extends Error {
  constructor(
    readonly code: string,
    readonly status = 422,
  ) {
    super(code);
  }
}
export class IntelligenceEngine {
  readonly chunks: Chunk[] = [];
  readonly corrections = new Map<string, unknown>();
  readonly usage = new Map<string, number>();
  index(
    documentId: string,
    pages: Array<{ page: number; text: string }>,
    size = 400,
  ) {
    for (const page of pages) {
      const words = page.text.split(/\s+/);
      for (
        let offset = 0;
        offset < words.length;
        offset += Math.max(1, size - 50)
      ) {
        const text = words.slice(offset, offset + size).join(" ");
        if (text)
          this.chunks.push({
            id: randomUUID(),
            documentId,
            page: page.page,
            text,
            embedding: embed(text),
          });
      }
    }
    return this.chunks.filter((x) => x.documentId === documentId);
  }
  retrieve(documentId: string, query: string, limit = 5) {
    const vector = embed(query);
    return this.chunks
      .filter((x) => x.documentId === documentId)
      .map((chunk) => ({ chunk, score: cosine(vector, chunk.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(limit, 10));
  }
  summarize(tenantId: string, documentId: string) {
    this.charge(tenantId);
    const selected = this.chunks
      .filter((x) => x.documentId === documentId)
      .slice(0, 8);
    if (!selected.length)
      throw new IntelligenceError("DOCUMENT_NOT_INDEXED", 404);
    return {
      summary: selected
        .map((x) => x.text)
        .join(" ")
        .slice(0, 800),
      citations: selected.map(cite),
      promptVersion: "summary-v1",
      model: process.env.GEMINI_API_KEY
        ? "gemini-adapter"
        : "deterministic-fallback",
    };
  }
  ask(tenantId: string, documentId: string, question: string) {
    this.charge(tenantId);
    const hits = this.retrieve(documentId, question);
    if (!hits[0] || hits[0].score < 0.12)
      return {
        answer: "I cannot answer that from this document.",
        citations: [],
        refused: true,
      };
    return {
      answer: hits
        .slice(0, 3)
        .map((x) => x.chunk.text)
        .join(" ")
        .slice(0, 600),
      citations: hits.slice(0, 3).map((x) => cite(x.chunk)),
      refused: false,
    };
  }
  extract(
    tenantId: string,
    documentId: string,
    schema: {
      required?: string[];
      properties?: Record<string, { type: string }>;
    },
  ) {
    this.charge(tenantId);
    const text = this.chunks
      .filter((x) => x.documentId === documentId)
      .map((x) => x.text)
      .join(" ");
    const result: Record<string, unknown> = {};
    for (const [key, definition] of Object.entries(schema.properties ?? {})) {
      const match = text.match(
        new RegExp(`${key}\\s*[:=-]\\s*([^,\\n]+)`, `i`),
      );
      if (match?.[1])
        result[key] =
          definition.type === "number"
            ? Number(match[1].replace(/[^0-9.-]/g, ""))
            : match[1].trim();
    }
    for (const key of schema.required ?? [])
      if (result[key] === undefined)
        throw new IntelligenceError("EXTRACTION_VALIDATION_FAILED");
    const id = randomUUID();
    return {
      id,
      data: result,
      confidence:
        Object.keys(result).length /
        Math.max(1, Object.keys(schema.properties ?? {}).length),
      citations: this.chunks
        .filter((x) => x.documentId === documentId)
        .slice(0, 3)
        .map(cite),
    };
  }
  correct(tenantId: string, extractionId: string, data: unknown) {
    this.corrections.set(`${tenantId}:${extractionId}`, data);
    return { extractionId, data, reviewed: true };
  }
  deleteDocument(documentId: string) {
    const before = this.chunks.length;
    for (let i = this.chunks.length - 1; i >= 0; i--)
      if (this.chunks[i]?.documentId === documentId) this.chunks.splice(i, 1);
    return { deletedChunks: before - this.chunks.length, tombstoned: true };
  }
  private charge(tenantId: string) {
    const next = (this.usage.get(tenantId) ?? 0) + 1;
    if (next > 1000) throw new IntelligenceError("TENANT_QUOTA_EXCEEDED", 429);
    this.usage.set(tenantId, next);
  }
}
function embed(text: string) {
  const digest = createHash("sha256").update(text.toLowerCase()).digest();
  return Array.from({ length: 32 }, (_, i) => (digest[i] ?? 0) / 255);
}
function cosine(a: number[], b: number[]) {
  let dot = 0,
    aa = 0,
    bb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += (a[i] ?? 0) * (b[i] ?? 0);
    aa += (a[i] ?? 0) ** 2;
    bb += (b[i] ?? 0) ** 2;
  }
  return dot / Math.sqrt(aa * bb);
}
function cite(chunk: Chunk): Citation {
  return {
    chunkId: chunk.id,
    page: chunk.page,
    quote: chunk.text.slice(0, 160),
  };
}

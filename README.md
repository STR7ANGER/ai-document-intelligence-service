# AI Document Intelligence Service

Secure, tenant-isolated document ingestion with signed uploads, asynchronous Go parsing, versioned page/block output, and a retrieval-ready PostgreSQL/pgvector design.

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run check
npm run build
```

Gemini is not called in this slice; later tasks use server-side structured output with citations, redaction, timeouts, and deterministic refusal behavior.

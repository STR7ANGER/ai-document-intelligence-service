# ADR 0001: Ingestion, tenancy, and data policy

The Next.js console uses versioned contracts to call the Hono API; it never imports server code. PostgreSQL owns document/job lifecycle, MongoDB stores flexible page/block trees, and object storage keeps encrypted source files in tenant-prefixed quarantine keys. Go workers consume versioned parse events and never receive API keys.

The smallest slice creates an idempotent document record, returns a 15-minute checksum-bound signed upload, verifies completion, and enqueues one parse job. API keys are stored only as hashes. Unsupported media, files above 25 MB, checksum mismatches, cross-tenant IDs, and invalid lifecycle transitions fail with stable codes and correlation IDs.

Sources remain in quarantine until malware and parser checks succeed. Default retention is 30 days for failed uploads and 365 days for ready sources; deletion tombstones metadata before asynchronous object erasure. Logs exclude document text, tokens, signed URLs, and keys.

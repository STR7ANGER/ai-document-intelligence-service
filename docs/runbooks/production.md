# Production runbook

Deploy additively: migrate PostgreSQL, deploy parser workers, API, then web. Verify health, a sandbox upload, parsing, retrieval, grounded refusal, and deletion. Roll back application images before schema; migrations are additive.

On parser backlog, pause ingestion, inspect dead letters and OCR latency, then replay transient failures by job ID. On citation failure, disable generative endpoints while keeping document access and deterministic extraction. On suspected leakage, revoke API keys, preserve audits, rotate object-store credentials, and run tenant-scoped deletion verification.

Gemini credentials are production inputs, never client-exposed. Requests use structured output, redaction, token/cost ceilings, timeout, two retries, and deterministic fallback/refusal. Current provider and OCR adapters remain sandbox implementations until credentials and golden-document conformance tests are supplied.

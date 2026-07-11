# AI Document Intelligence Service — 30-Task Execution Plan

Complete tasks in order unless a dependency is explicitly removed. Each day has 10 active tasks; unfinished work rolls forward before later tasks begin. Keep at most 10 task checkboxes marked `[~]` (in progress) at once; use `[x]` only after verification.

## Day 1 — Foundation and first vertical slice (Tasks 1–10)

- [ ] 1. Design workspace, storage, Docker, CI, tenancy, data policy, and job contracts; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 2. Implement workspace, storage, Docker, CI, tenancy, data policy, and job contracts; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 3. Verify workspace, storage, Docker, CI, tenancy, data policy, and job contracts with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 4. Design auth, API keys, documents, versions, signed uploads, and lifecycle states; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 5. Implement auth, API keys, documents, versions, signed uploads, and lifecycle states; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 6. Verify auth, API keys, documents, versions, signed uploads, and lifecycle states with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 7. Design Go parsing pipeline, OCR adapter, page/block model, and failure handling; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 8. Implement Go parsing pipeline, OCR adapter, page/block model, and failure handling; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 9. Verify Go parsing pipeline, OCR adapter, page/block model, and failure handling with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 10. Design chunking strategies, embeddings, pgvector indexing, and retrieval evaluation; write acceptance criteria, contracts, risks, and the smallest vertical slice.

## Day 2 — Core workflows and integrations (Tasks 11–20)

- [ ] 11. Implement chunking strategies, embeddings, pgvector indexing, and retrieval evaluation; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 12. Verify chunking strategies, embeddings, pgvector indexing, and retrieval evaluation with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 13. Design Gemini summary pipeline, citation validation, prompt versions, and cache; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 14. Implement Gemini summary pipeline, citation validation, prompt versions, and cache; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 15. Verify Gemini summary pipeline, citation validation, prompt versions, and cache with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 16. Design grounded ask endpoint, context limits, refusal behavior, and answer evidence; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 17. Implement grounded ask endpoint, context limits, refusal behavior, and answer evidence; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 18. Verify grounded ask endpoint, context limits, refusal behavior, and answer evidence with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 19. Design JSON-schema extraction, validation, retries, invoice/contract presets, and corrections; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 20. Implement JSON-schema extraction, validation, retries, invoice/contract presets, and corrections; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.

## Day 3 — Advanced behavior and production hardening (Tasks 21–30)

- [ ] 21. Verify JSON-schema extraction, validation, retries, invoice/contract presets, and corrections with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 22. Design console viewer, job progress, search, extraction review, and usage dashboard; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 23. Implement console viewer, job progress, search, extraction review, and usage dashboard; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 24. Verify console viewer, job progress, search, extraction review, and usage dashboard with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 25. Design quotas, redaction, deletion, encryption, metrics, tracing, and cost controls; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 26. Implement quotas, redaction, deletion, encryption, metrics, tracing, and cost controls; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 27. Verify quotas, redaction, deletion, encryption, metrics, tracing, and cost controls with tests, failure cases, telemetry, documentation, and a reviewable demo.
- [ ] 28. Design golden-doc/integration/E2E tests, SDK examples, API docs, and operations runbook; write acceptance criteria, contracts, risks, and the smallest vertical slice.
- [ ] 29. Implement golden-doc/integration/E2E tests, SDK examples, API docs, and operations runbook; keep frontend, API, domain logic, workers, and persistence in their declared boundaries.
- [ ] 30. Verify golden-doc/integration/E2E tests, SDK examples, API docs, and operations runbook with tests, failure cases, telemetry, documentation, and a reviewable demo.

## Task completion checklist

A task is complete only when code is formatted and typed, tests pass, migrations are reproducible, UI states are handled, authorization is enforced, logs contain no secrets, and relevant docs are updated. Track blockers beneath the task instead of silently widening scope.


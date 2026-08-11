# ADR 0002: Parsing, chunking, and retrieval

The Go pipeline emits versioned pages containing ordered heading, paragraph, table, and OCR blocks with confidence and bounding-box provenance. Native text is preferred; an OCR adapter is used only for image-only pages. Jobs retry transient OCR failures three times with exponential backoff, quarantine malformed documents, and dead-letter deterministic failures.

Tasks 11–12 will implement structure-aware chunks: headings stay with following paragraphs, tables remain atomic, and chunks overlap by at most 15%. Embeddings use a versioned model and 768-dimensional pgvector column with HNSW cosine indexing. Evaluation uses a checked-in query/citation set; release gates require recall@5 ≥ 0.85 and citation-page accuracy ≥ 0.95. Tenant filters are applied before vector ranking and cache keys include document version plus embedding model.

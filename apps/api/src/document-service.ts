import { createHash, randomUUID } from "node:crypto";
import type {
  CreateDocument,
  DocumentStatus,
  JobEvent,
} from "@documents/contracts";
export interface DocumentRecord extends CreateDocument {
  id: string;
  tenantId: string;
  status: DocumentStatus;
  version: number;
  objectKey: string;
  createdAt: string;
}
export class DocumentError extends Error {
  constructor(
    readonly code: string,
    readonly status = 409,
  ) {
    super(code);
  }
}
export class DocumentService {
  readonly documents = new Map<string, DocumentRecord>();
  readonly jobs: JobEvent[] = [];
  readonly idempotency = new Map<string, DocumentRecord>();
  create(
    tenantId: string,
    input: CreateDocument,
    idempotencyKey: string,
    now = new Date(),
  ) {
    const prior = this.idempotency.get(`${tenantId}:${idempotencyKey}`);
    if (prior) return this.uploadResponse(prior);
    const record: DocumentRecord = {
      ...input,
      id: randomUUID(),
      tenantId,
      status: "PENDING_UPLOAD",
      version: 1,
      objectKey: `quarantine/${tenantId}/${randomUUID()}`,
      createdAt: now.toISOString(),
    };
    this.documents.set(record.id, record);
    this.idempotency.set(`${tenantId}:${idempotencyKey}`, record);
    return this.uploadResponse(record);
  }
  complete(tenantId: string, id: string, checksum: string, now = new Date()) {
    const record = this.get(tenantId, id);
    if (record.status !== "PENDING_UPLOAD")
      throw new DocumentError("INVALID_DOCUMENT_STATE", 422);
    if (checksum !== record.checksum)
      throw new DocumentError("CHECKSUM_MISMATCH", 422);
    record.status = "QUEUED";
    this.jobs.push({
      id: randomUUID(),
      tenantId,
      documentId: id,
      versionId: `${id}:v${record.version}`,
      type: "document.parse.requested",
      attempt: 1,
      occurredAt: now.toISOString(),
    });
    return record;
  }
  fail(tenantId: string, id: string) {
    const record = this.get(tenantId, id);
    record.status = "FAILED";
    return record;
  }
  list(tenantId: string) {
    return [...this.documents.values()].filter((x) => x.tenantId === tenantId);
  }
  get(tenantId: string, id: string) {
    const record = this.documents.get(id);
    if (!record || record.tenantId !== tenantId)
      throw new DocumentError("DOCUMENT_NOT_FOUND", 404);
    return record;
  }
  private uploadResponse(record: DocumentRecord) {
    const signature = createHash("sha256")
      .update(record.objectKey)
      .digest("hex");
    return {
      document: record,
      upload: {
        method: "PUT",
        url: `http://localhost:9000/documents/${record.objectKey}?signature=${signature}`,
        headers: {
          "content-type": record.mediaType,
          "x-checksum-sha256": record.checksum,
        },
        expiresInSeconds: 900,
      },
    };
  }
}

import { z } from "zod";
export const documentStatus = z.enum([
  "PENDING_UPLOAD",
  "UPLOADED",
  "QUEUED",
  "PROCESSING",
  "READY",
  "FAILED",
  "DELETED",
]);
export const createDocumentSchema = z.object({
  fileName: z.string().trim().min(1).max(240),
  mediaType: z.enum([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "text/plain",
  ]),
  bytes: z.number().int().positive().max(25_000_000),
  checksum: z.string().regex(/^[a-f0-9]{64}$/),
});
export const tenantContextSchema = z.object({
  tenantId: z.string().min(1),
  actorId: z.string().min(1),
  apiKey: z.string().min(16),
  correlationId: z.string().min(1),
});
export type CreateDocument = z.infer<typeof createDocumentSchema>;
export type DocumentStatus = z.infer<typeof documentStatus>;
export interface JobEvent {
  id: string;
  tenantId: string;
  documentId: string;
  versionId: string;
  type: "document.parse.requested";
  attempt: number;
  occurredAt: string;
}

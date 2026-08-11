export class DocumentsClient {
  constructor(
    private baseUrl: string,
    private headers: Record<string, string>,
  ) {}
  async ask(documentId: string, question: string) {
    return this.post(`/v1/documents/${documentId}/ask`, { question });
  }
  async extract(documentId: string, schema: unknown) {
    return this.post(`/v1/documents/${documentId}/extract`, { schema });
  }
  private async post(path: string, body: unknown) {
    const response = await fetch(this.baseUrl + path, {
      method: "POST",
      headers: { "content-type": "application/json", ...this.headers },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Documents API ${response.status}`);
    return response.json();
  }
}

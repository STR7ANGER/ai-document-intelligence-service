const docs = [
  { name: "Vendor agreement.pdf", state: "Ready", pages: 18 },
  { name: "August invoice.pdf", state: "Processing", pages: 4 },
];
export default function Page() {
  return (
    <main>
      <header>
        <div>
          <span>Document intelligence</span>
          <h1>Every answer, anchored.</h1>
          <p>
            Upload documents, extract structure, and preserve page-level
            provenance.
          </p>
        </div>
        <button>Upload document</button>
      </header>
      <section className="stats">
        <article>
          <strong>24</strong>
          <small>Documents</small>
        </article>
        <article>
          <strong>892</strong>
          <small>Pages parsed</small>
        </article>
        <article>
          <strong>99.2%</strong>
          <small>Pipeline health</small>
        </article>
      </section>
      <h2>Recent documents</h2>
      <section className="grid">
        {docs.map((doc) => (
          <article className="card" key={doc.name}>
            <b>{doc.state}</b>
            <h3>{doc.name}</h3>
            <p>{doc.pages} pages · citations available</p>
            <button>Open viewer →</button>
          </article>
        ))}
      </section>
    </main>
  );
}

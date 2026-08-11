export default function Viewer() {
  return (
    <main>
      <header>
        <div>
          <span>Evidence viewer</span>
          <h1>Contract review</h1>
          <p>
            Every generated statement links back to a page and source block.
          </p>
        </div>
        <button>Export JSON</button>
      </header>
      <section className="grid">
        <article className="card">
          <b>Page 3 · Clause 8</b>
          <h3>Termination notice</h3>
          <p>Either party may terminate with 30 days written notice.</p>
        </article>
        <article className="card">
          <b>Extraction review</b>
          <h3>Notice period: 30 days</h3>
          <p>Confidence 0.96 · corrected values retain an audit trail.</p>
          <button>Approve →</button>
        </article>
      </section>
    </main>
  );
}

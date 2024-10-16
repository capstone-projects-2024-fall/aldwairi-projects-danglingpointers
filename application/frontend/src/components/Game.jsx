export default function Game() {
  return (
    <main>
      <section className="game">
        <div className="stack">
          <div className="memory1" id="memory"></div>
          <div className="memory2" id="memory"></div>
          <div className="memory3" id="memory"></div>
          <div className="memory4" id="memory"></div>
          <div className="memory5" id="memory"></div>
          <div className="memory6" id="memory"></div>
        </div>
        <div className="garbage-collector"></div>
        <div className="recycling-bin"></div>
      </section>
    </main>
  );
}

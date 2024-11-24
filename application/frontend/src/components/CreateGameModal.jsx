export default function CreateGameModal({ setIsCreateGame }) {
  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <h1 style={{ fontSize: "4rem" }}>MODAL...</h1>
      <button className="btn-create-game" onClick={() => setIsCreateGame(false)}>Create Game</button>
    </div>
  );
}

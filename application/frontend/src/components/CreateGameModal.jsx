export default function CreateGameModal({ setIsCreateGame }) {
  // Close modal on outside click
  const handleClickOutside = (e) => {
    if (e.target.className === "modal-overlay") {
      setIsCreateGame(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClickOutside}>
      <div className="modal-content">
        <h1>Create Versus Game</h1>
        <form>
          <label>
            Game Type:
            <select>
              <option value="Random">Random</option>
              <option value="Friends">Friends</option>
            </select>
          </label>
          <button type="submit" className="btn-create-game">
            Create Game
          </button>
        </form>
        <button className="btn-close-modal" onClick={() => setIsCreateGame(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

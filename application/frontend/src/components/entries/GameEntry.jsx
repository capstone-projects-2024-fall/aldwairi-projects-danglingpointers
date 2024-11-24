import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GameEntry({ gameId, users, status, scores = [] }) {
  const [btnColor, setBtnColor] = useState("blue");
  const navigate = useNavigate();

  useEffect(() => {
    status === "Complete"
      ? setBtnColor("green")
      : status === "Pending"
      ? setBtnColor("orange")
      : setBtnColor("blue");
  }, [status]);

  function handleClick() {
    console.log(gameId);
    navigate(`game/game_id_${gameId}`);
  }

  return (
    <section className="base-entry game-entry">
      <div className="game-users">
        {users.map((user, index) =>
          user.id ? <p key={index}>User {user.id}</p> : null
        )}
      </div>
      <div className="game-scores">
        {scores.map((score, index) =>
          score ? <p key={index}>Score: {score}</p> : null
        )}
      </div>
      <div className="game-status">
        Status:
        <button
          className={`btn-status`}
          style={{ background: btnColor }}
          onClick={handleClick}
        >
          {status === "Pending" ? "Join Game" : status}
        </button>
      </div>
    </section>
  );
}

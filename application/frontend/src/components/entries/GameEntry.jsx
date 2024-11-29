import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";

export default function GameEntry({
  gameId,
  gameLength,
  users,
  status,
  scores = [],
}) {
  const [btnColor, setBtnColor] = useState("green");
  const navigate = useNavigate();

  useEffect(() => {
    status === "Active"
      ? setBtnColor("blue")
      : status === "Pending"
      ? setBtnColor("orange")
      : setBtnColor("green");
  }, [status]);

  function handleClick() {
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
        {scores.map((score, index) => (
          <p key={index}>
            {score ? `Score: ${score}` : users > 1 ? "Score: 0" : null}
          </p>
        ))}
      </div>
      <div className="flex-row-container">
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
        <div>{gameLength ? `Length: ${convertSecondsToMinutes(gameLength)}` : ""}</div>
      </div>
    </section>
  );
}

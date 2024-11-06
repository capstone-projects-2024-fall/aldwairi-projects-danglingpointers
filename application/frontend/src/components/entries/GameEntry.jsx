import { useState, useEffect } from "react";

export default function GameEntry({
  users,
  status,
  scores = [],
}) {
  const [btnColor, setBtnColor] = useState("blue");

  useEffect(() => {
    status === "Complete"
      ? setBtnColor("green")
      : status === "Pending"
      ? setBtnColor("orange")
      : setBtnColor("blue");
  }, [status]);

  return (
    <section className="base-entry game-entry">
      <div className="game-users">
        {users.map((user, index) =>
          user.id ? (
            <p key={index}>
              User {user.id}
            </p>
          ) : null
        )}
      </div>
      <div className="game-scores">
        {scores.map((score, index) =>
          score ? (
            <p key={index}>
              Score: {score}
            </p>
          ) : null
        )}
      </div>
      <div className="game-status">
        Status:
        <button className={`btn-status`} style={{ background: btnColor }}>
          {status}
        </button>
      </div>
    </section>
  );
}

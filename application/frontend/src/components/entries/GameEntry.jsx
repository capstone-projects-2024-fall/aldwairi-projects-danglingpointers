import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import { HOST_PATH } from "../../scripts/constants";
import axios from "axios";

export default function GameEntry({
  gameId,
  gameLength,
  users,
  status,
  scores = [],
}) {
  const [btnColor, setBtnColor] = useState("green");
  const [currentUsers, setCurrentUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersArray = [];
      try {
        const userResponse = await axios.get(
          `${HOST_PATH}/users/?user_id=${users[0].id}`
        );
        usersArray.push(userResponse.data[0]);
        if (users[1].id) {
          const opponentResponse = await axios.get(
            `${HOST_PATH}/users/?user_id=${users[1].id}`
          );
          usersArray.push(opponentResponse.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
      setCurrentUsers(usersArray);
    };

    fetchUsers();
  }, [users]);

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
      {currentUsers.map((user, i) => (
        <p key={i}>{user.username}</p>
      ))}
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
        <div>
          {gameLength ? `Length: ${convertSecondsToMinutes(gameLength)}` : ""}
        </div>
      </div>
    </section>
  );
}

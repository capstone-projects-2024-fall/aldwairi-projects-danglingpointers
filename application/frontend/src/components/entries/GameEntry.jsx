import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import { HOST_PATH } from "../../scripts/constants";
import axios from "axios";
import useUserAuthStore from "../../stores/userAuthStore";

export default function GameEntry({
  gameId,
  gameLength,
  users,
  status,
  scores = [],
}) {
  const [btnColor, setBtnColor] = useState("green");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [isOnline, setIsOnline] = useState([]);
  const { userId } = useUserAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersArray = [];
      const onlineStatusArray = [];
      try {
        const userResponse = await axios.get(
          `${HOST_PATH}/users/?user_id=${users[0].id}`
        );

        const userMetaDataResponse = await axios.get(
          `${HOST_PATH}/user-metadata/?user_id=${users[0].id}`
        );

        usersArray.push(userResponse.data[0]);
        onlineStatusArray.push(userMetaDataResponse.data[0].is_online);

        if (users[1].id) {
          const opponentResponse = await axios.get(
            `${HOST_PATH}/users/?user_id=${users[1].id}`
          );
          const opponentMetaDataResponse = await axios.get(
            `${HOST_PATH}/user-metadata/?user_id=${users[1].id}`
          );
          usersArray.push(opponentResponse.data[0]);
          onlineStatusArray.push(opponentMetaDataResponse.data[0].is_online);
        }
      } catch (error) {
        console.log(error);
      }
      setCurrentUsers(usersArray);
      setIsOnline(onlineStatusArray);
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
    if (status === "Pending" && userId) navigate(`/versus/?game_id=${gameId}`);
    else navigate(`/game/game_id_${gameId}`);
  }

  return (
    <section className="base-entry game-entry">
      <div className="game-scores">
        {currentUsers.map((user, i) => (
          <p key={i}>
            <Link to={`/profile/${user.username}`}>{user.username}</Link>
            <span>{isOnline[i] ? " 🟢" : " 🔴"}</span>
          </p>
        ))}
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
            style={{
              background: btnColor,
              cursor:
                status === "Pending" && !userId ? "not-allowed" : "pointer",
            }}
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

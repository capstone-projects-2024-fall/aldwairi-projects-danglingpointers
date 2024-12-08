import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";

export default function CreateGameEntry({
  status,
  lobbyGames,
  setLobbyGames,
  setIsCreateGame,
}) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState();
  const [isFriendsChecked, setIsFriendsChecked] = useState(false);
  const { userId } = useUserAuthStore();
  const navigate = useNavigate();

  const handleCreatePendingGame = async () => {
    if (isFriendsChecked && !selectedFriend) return;

    status = "Pending";
    const newGame = {
      player_one: userId,
      mode: "Versus",
      status: status,
    };
    let newGameId;

    try {
      const response = await axios.post(`${HOST_PATH}/games/`, newGame);
      console.log("Response data:", response.data);
      newGameId = response.data.id;
    } catch (error) {
      console.error(error);
    } finally {
      const oldGames = lobbyGames;
      oldGames.shift();

      if (!isFriendsChecked) setLobbyGames([newGame, ...oldGames]);
      else {
        // Ping user dashboard
        setLobbyGames(oldGames);
      }

      setIsCreateGame(false);
      navigate(`/versus/?game_id=${newGameId}`);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsResponse = await axios.get(`${HOST_PATH}/friends/`, {
          params: { user_id: userId },
        });
        setFriends(friendsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <section className="base-entry create-game-entry">
      <div className="create-container">
        <label>
          <input
            type="checkbox"
            checked={isFriendsChecked}
            onChange={() => setIsFriendsChecked(!isFriendsChecked)}
          />
          Play a Friend
        </label>
        {isFriendsChecked ? (
          <select
            className="select-friends"
            value={selectedFriend}
            onChange={(e) => {
              if (e.target.value === "-Select-") setSelectedFriend("");
              else setSelectedFriend(e.target.value);
            }}
          >
            <option>-Select-</option>
            {Object.keys(friends).map((key, index) => (
              <option key={index}>{friends[key].username}</option>
            ))}
          </select>
        ) : null}
      </div>
      <button
        id = "startv-game"
        className="btn-status"
        style={{
          background: "purple",
          cursor:
            (selectedFriend && isFriendsChecked) || !isFriendsChecked
              ? "pointer"
              : "not-allowed",
        }}
        onClick={handleCreatePendingGame}
      >
        {isFriendsChecked && selectedFriend
          ? `Play with ${selectedFriend}`
          : isFriendsChecked
          ? `Select a Friend`
          : "Play Random"}
      </button>
    </section>
  );
}

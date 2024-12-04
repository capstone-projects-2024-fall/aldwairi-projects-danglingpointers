import axios from "axios";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";

export default function CreateGameEntry({ status, lobbyGames, setLobbyGames }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState();
  const [selectedFriend, setSelectedFriend] = useState();
  const [isFriendsChecked, setIsFriendsChecked] = useState(false);
  const { userId } = useUserAuthStore();

  const handleCreatePendingGame = async () => {
    if (isFriendsChecked && !selectedFriend) return;
    
    status = "Pending";
    const newGame = {
      player_one: userId,
      mode: "Versus",
      status: status,
    };

    try {
      const response = await axios.post(`${HOST_PATH}/games/`, newGame);
      console.log("Response data:", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLobbyGames([...lobbyGames.slice(1)])
      if (!isFriendsChecked) setLobbyGames([newGame, ...lobbyGames])
    }
  };

  useEffect(() => {
    setFriends(["friend1", "friend2"]);
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
            onChange={(e) => setSelectedFriend(e.target.value)}
          >
            <option>-Select-</option>
            {friends.map((friend, index) => (
              <option key={index}>{friend}</option>
            ))}
          </select>
        ) : null}
      </div>
      <button
        className="btn-status"
        style={{ background: "purple" }}
        onClick={handleCreatePendingGame}
      >
        {isFriendsChecked && selectedFriend ? `Play with ${selectedFriend}` : isFriendsChecked ? `Select a Friend` : "Play Random"}
      </button>
    </section>
  );
}

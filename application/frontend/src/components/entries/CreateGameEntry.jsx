import axios from "axios";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";

export default function CreateGameEntry() {
  const [friends, setFriends] = useState([]);
  const [isFriendsChecked, setIsFriendsChecked] = useState(false);

  const handleCreatePendingGame = async () => {
    try {
      const response = await axios.post(`${HOST_PATH}/games/?game_id`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setFriends(["friend1", "friend2"]);
  }, []);

  return (
    <section className="base-entry create-game-entry">
      <input
        type="checkbox"
        checked={isFriendsChecked}
        onChange={() => setIsFriendsChecked(!isFriendsChecked)}
      />
      {isFriendsChecked ? (
        <select className="select-friends">
          {friends.map((friend, index) => (
            <option key={index}>{friend}</option>
          ))}
        </select>
      ) : (
        <div className="random">Random</div>
      )}
      <button
        className="btn-status"
        style={{ background: "purple" }}
        onClick={handleCreatePendingGame}
      >
        Create Game
      </button>
    </section>
  );
}

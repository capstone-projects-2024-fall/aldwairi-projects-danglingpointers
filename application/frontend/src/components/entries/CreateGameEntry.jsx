import axios from "axios";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";

export default function CreateGameEntry() {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState();
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
    setSelectedFriend(friends[0])
  }, [friends]);

  return (
    <section className="base-entry create-game-entry">
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
          {friends.map((friend, index) => (
            <option key={index}>{friend}</option>
          ))}
        </select>
      ) : null}
      <button
        className="btn-status"
        style={{ background: "purple" }}
        onClick={handleCreatePendingGame}
      >
        {isFriendsChecked ? `Play with ${selectedFriend}` : "Play Random"}
      </button>
    </section>
  );
}

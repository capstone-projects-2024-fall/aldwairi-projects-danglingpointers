import { useEffect, useState } from "react";

export default function CreateGameEntry() {
  const [friends, setFriends] = useState(["friend1", "friend2"]);
  const [isFriendsChecked, setIsFriendsChecked] = useState(false);
  const handleCreatePendingGame = async () => {};

  useEffect(() => {
    console.log("get friends list here!");
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
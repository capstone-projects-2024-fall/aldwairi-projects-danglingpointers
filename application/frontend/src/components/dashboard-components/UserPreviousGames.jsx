import { useState, useEffect } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";
import GameEntry from "../entries/GameEntry";

export default function UserPreviousGames({ isInboxOpen }) {
  const [watchPreviews, setWatchPreviews] = useState([]);
  const { userId } = useUserAuthStore();

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${HOST_PATH}/games?recent_games=true&user_id=${userId}`
        );
        setWatchPreviews(
          response.data.filter((game) => game.status === "Complete")
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="user-previous-games default-scrollbar mb-def" style={isInboxOpen ? {display: "none"}: null}>
      <div>
        <h1 className="watchtitle">Game History</h1>
      </div>
      <article id= "watch-list" lassName="watchlist-container">
        {watchPreviews.map((game, index) => (
          <GameEntry
            key={index}
            gameLength={game.game_length}
            gameId={game.id}
            users={[
              { id: game.player_one, name: "" },
              { id: game.player_two, name: "" },
            ]}
            status={game.status}
            scores={[game.player_one_score, game.player_two_score]}
          />
        ))}
      </article>
    </div>
  );
}

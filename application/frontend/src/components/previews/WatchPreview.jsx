import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";

export default function WatchPreview() {
  const [watchGames, setWatchGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const watchResponse = await axios.get(`${HOST_PATH}/games?watch=true`);

        setWatchGames(watchResponse.data ? watchResponse.data : []);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="preview">
        <h2>Watch Preview</h2>
        {watchGames.length > 0 ? (
          <ul>
            {watchGames.map((game, index) => (
              <GameEntry
                key={index}
                users={[{id: game.player_one, name:""}, {id: game.player_two, name:""}]}
                status={game.status}
                gameLink={game.link}
                mode={game.mode}
                scores={[game.player_one_score, game.player_two_score]}
              />
            ))}
          </ul>
        ) : (
          <p>No pending games available.</p>
        )}
    </main>
  );
}

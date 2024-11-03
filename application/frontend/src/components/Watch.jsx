import { useEffect, useState } from "react";
import axios from "axios";

export default function Watch() {
  const [watchGames, setWatchGames] = useState([]);
  const HOST_PATH = "http://localhost:8000/api";

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
    <main className="watch-home">
      <article className="watch-games">
        <h2>Watch</h2>
        {watchGames.length > 0 ? (
          <ul>
            {watchGames.map((game, index) => (
              <li key={index}>
                Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
                {game.player_two_score || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No active games available.</p>
        )}
      </article>
    </main>
  );
}

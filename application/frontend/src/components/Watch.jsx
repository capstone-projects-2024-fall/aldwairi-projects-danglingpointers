import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

export default function Watch() {
  const [watchGames, setWatchGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const watchResponse = await axios.get(`${HOST_PATH}/games?watch=true`);

        // Filter the games to include only those with a "Active" status
        const activeGames = watchResponse.data.filter(game => game.status === "Active"); 

        setWatchGames(activeGames);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  // Separate games into Solo and Versus categories
  const soloGames = watchGames.filter(game => game.mode === "Solo");
  const versusGames = watchGames.filter(game => game.mode === "Versus");

  return (
    <main className="main-watch">
      <article className="watch-games">
        <h2>Watch</h2>

        {soloGames.length > 0 && (
          <section>
            <h3>Solo Games</h3>
            <ul>
              {soloGames.map((game, index) => (
                <li key={index}>
                  Score: {game.player_one_score} vs N/A
                </li>
              ))}
            </ul>
          </section>
        )}

        {versusGames.length > 0 && (
          <section>
            <h3>Versus Games</h3>
            <ul>
              {versusGames.map((game, index) => (
                <li key={index}>
                  Mode: {game.mode}, Score: {game.player_one_score} vs {game.player_two_score || "N/A"}
                </li>
              ))}
            </ul>
          </section>
        )}

        {soloGames.length === 0 && versusGames.length === 0 && (
          <p>No active games available.</p>
        )}
      </article>
    </main>
  );
}

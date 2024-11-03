import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [lobbyGames, setLobbyGames] = useState([]);
  const [watchGames, setWatchGames] = useState([]);
  const HOST_PATH = "http://localhost:8000/api";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const lobbyResponse = await axios.get(`${HOST_PATH}/games?lobby=true`);
        const watchResponse = await axios.get(`${HOST_PATH}/games?watch=true`);

        console.log(lobbyResponse);

        setLobbyGames(lobbyResponse.data ? lobbyResponse.data : []);
        setWatchGames(watchResponse.data ? watchResponse.data : []);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="main-home">
      <div className="preview-container">
        <article className="preview-placeholder">
          <h2>Lobby Preview</h2>
          {lobbyGames.length > 0 ? (
            <ul>
              {lobbyGames.map((game, index) => (
                <li key={index}>
                  Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
                  {game.player_two_score || "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending games available.</p>
          )}
        </article>
        <article className="preview-placeholder">
          <h2>Watch Preview</h2>
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
      </div>
    </main>
  );
}

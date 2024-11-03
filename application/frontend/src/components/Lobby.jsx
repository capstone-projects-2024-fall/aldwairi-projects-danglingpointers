import { useEffect, useState } from "react";
import axios from "axios";

export default function Lobby() {
  const [lobbyGames, setLobbyGames] = useState([]);
  const HOST_PATH = "http://localhost:8000/api";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const lobbyResponse = await axios.get(`${HOST_PATH}/games?lobby=true`);

        setLobbyGames(lobbyResponse.data ? lobbyResponse.data : []);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="main-lobby">
      <article className="lobby-article">
        <h2>Lobby</h2>
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
    </main>
  );
}

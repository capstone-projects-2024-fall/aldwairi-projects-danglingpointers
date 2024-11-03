import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

export default function Lobby() {
  const [lobbyGames, setLobbyGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const lobbyResponse = await axios.get(`${HOST_PATH}/games?lobby=true`);

        // Filter the games to include only those with a "Pending" status
        const pendingGames = lobbyResponse.data.filter(game => game.status === "Pending");

        setLobbyGames(pendingGames);
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

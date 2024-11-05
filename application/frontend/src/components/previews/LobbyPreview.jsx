import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";

// coupling: Lobby.jsx
export default function LobbyPreview() {
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
    <main className="preview">
        <h2>Lobby Preview</h2>
        {lobbyGames.length > 0 ? (
          <ul>
            {lobbyGames.map((game, index) => (
              <GameEntry
                key={index}
                users={[{id: game.player_one, name:""}, {id: game.player_two, name:""}]}
                status={game.status}
                gameLink={game.link}
                mode={game.mode}
                scores={[game.player_one_score, game.player_two_score]}
              />

              // <li key={index}>
              //   Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
              //   {game.player_two_score || "N/A"}
              // </li>
            ))}
          </ul>
        ) : (
          <p>No pending games available.</p>
        )}
    </main>
  );
}

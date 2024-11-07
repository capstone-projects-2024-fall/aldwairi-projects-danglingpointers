import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LobbyPreview() {
  const [lobbyGames, setLobbyGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const lobbyResponse = await axios.get(`${HOST_PATH}/games?lobby=true`);
        setLobbyGames(lobbyResponse.data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <article className="default-scrollbar">
      <div className="preview">
        <div className="link-flex">
          <Link to="/lobby">
            <h2>Lobby</h2>
          </Link>
          <span></span>
        </div>
        {lobbyGames.length > 0 ? (
          <ul>
            {lobbyGames.map((game, index) => (
              <GameEntry
                key={index}
                users={[
                  { id: game.player_one, name: "" },
                  { id: game.player_two, name: "" },
                ]}
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
        <Link to="/lobby">
          <p>View more pending games</p>
        </Link>
      </div>
    </article>
  );
}

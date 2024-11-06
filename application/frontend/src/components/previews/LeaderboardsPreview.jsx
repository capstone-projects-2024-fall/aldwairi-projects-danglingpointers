import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LeaderboardsPreview() {
  const [leaderboardsSolo, setLeaderboardsSolo] = useState([]);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const soloResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_solo=true`
        );
        const versusResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_versus=true`
        );

        setLeaderboardsSolo(soloResponse.data.slice(0, 5) || []);
        setLeaderboardsVersus(versusResponse.data.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <article className="leaderboards-preview-container default-scrollbar">
      <div className="leaderboards-preview preview">
        <div className="link-flex">
          <Link to="/leaderboards">
            <h2>Solo Leaderboards</h2>
          </Link>
          <span></span>
        </div>
        {leaderboardsSolo ? (
          <ul>
            {leaderboardsSolo.map((game, index) => (
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
          <p>No solo leaderboards available.</p>
        )}
      </div>
      <div className="leaderboards-preview preview">
        <div className="link-flex">
          <Link to="/leaderboards">
            <h2>Versus Leaderboards</h2>
          </Link>
          <span></span>
        </div>
        {leaderboardsVersus ? (
          <ul>
            {leaderboardsVersus.map((game, index) => (
              <GameEntry
                key={index}
                users={[
                  { id: game.player_one, name: "" },
                  { id: game.player_two, name: "" },
                ]}
                status={game.status}
                scores={[game.player_one_score, game.player_two_score]}
              />
            ))}
          </ul>
        ) : (
          <p>No solo leaderboards available.</p>
        )}
      </div>
    </article>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LeaderboardsSolo() {
  const [leaderboardsSolo, setLeaderboardsSolo] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const soloResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_solo=true`
        );

        setLeaderboardsSolo(soloResponse.data);

            } catch (error) {
                console.error('Error fetching games data:', error);
            }
        };

        fetchGames();
    }, []);

  return (
    <article className="default-scrollbar">
        <div className="leaderboard">
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
      </article>

  );
}

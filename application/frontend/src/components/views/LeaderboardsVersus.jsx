import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LeaderboardsVersus() {
  const [leaderboardsVersus, setLeaderboardsVersus] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const versusResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_versus=true`
        );

        setLeaderboardsVersus(versusResponse.data);

            } catch (error) {
                console.error('Error fetching games data:', error);
            }
        };

        fetchGames();
    }, []);

return(
    <article className="default-scrollbar">
        <div className="leaderboard">
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

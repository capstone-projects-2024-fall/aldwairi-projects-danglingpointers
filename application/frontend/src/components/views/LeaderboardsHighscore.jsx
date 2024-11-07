import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LeaderboardsHighScore() {
  const [leaderboardsHighScore, setLeaderboardsHighScore] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const highScoreResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_highscore=true`
        );
            const highScores = [];
                (highScoreResponse.data || []).forEach((game) => {
                    if (game.player_one_score) highScores.push({ ...game, score: game.player_one_score });
                    if (game.player_two_score) highScores.push({ ...game, score: game.player_two_score });
                });
                highScores.sort((a, b) => b.score - a.score);
                setLeaderboardsHighScore(highScores);
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
                    <h2>Highscore Leaderboards</h2>
                </Link>
            <span></span>
            </div>
                {leaderboardsHighScore ? (
                    <ul>
                        {leaderboardsHighScore.map((game, index) => (
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
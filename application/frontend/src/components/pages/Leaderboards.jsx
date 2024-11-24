import LeaderboardsVersus from "../views/LeaderboardsVersus";
import LeaderboardsHighScore from "../views/LeaderboardsHighscore";
import LeaderboardsSolo from "../views/LeaderboardsSolo";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { HOST_PATH } from "../../scripts/constants";
import axios from "axios";

export default function Leaderboards() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardsSolo, setLeaderboardsSolo] = useState(null);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState(null);
  const [leaderboardsHighScore, setLeaderboardsHighScore] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const soloResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_solo=true`
        );

        setLeaderboardsSolo(soloResponse.data);

        const versusResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_versus=true`
        );

        setLeaderboardsVersus(versusResponse.data);

        const highScoreResponse = await axios.get(
            `${HOST_PATH}/games?leaderboards_highscore=true`
          );
          const highScores = [];
          (
            highScoreResponse.data
              .filter((x) => x.status === "Complete")
              .slice(0, 50) || []
          ).forEach((game) => {
            if (game.player_one_score)
              highScores.push({ ...game, score: game.player_one_score });
            if (game.player_two_score)
              highScores.push({ ...game, score: game.player_two_score });
          });
          highScores.sort((a, b) => b.score - a.score);

          setLeaderboardsHighScore(highScores);

          setIsLoading(false);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="leaderboards-default">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="leaderboards-container">
          <LeaderboardsSolo leaderboardsSolo={leaderboardsSolo} />
          <LeaderboardsVersus leaderboardsVersus={leaderboardsVersus}/>
          <LeaderboardsHighScore leaderboardsHighScore={leaderboardsHighScore}/>
        </div>
      )}
    </main>
  );
}

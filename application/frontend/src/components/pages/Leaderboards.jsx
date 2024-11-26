import LeaderboardsVersus from "../views/LeaderboardsVersus";
import LeaderboardsHighScore from "../views/LeaderboardsLongestGames";
import LeaderboardsSolo from "../views/LeaderboardsSolo";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { HOST_PATH } from "../../scripts/constants";
import axios from "axios";

export default function Leaderboards() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardsSolo, setLeaderboardsSolo] = useState(null);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState(null);
  const [longestGames, setLongestGames] = useState(null);

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

        const longestGamesResponse = await axios.get(
          `${HOST_PATH}/games?longest_games=true`
        );

        setLongestGames(longestGamesResponse.data);

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
          <LeaderboardsVersus leaderboardsVersus={leaderboardsVersus} />
          <LeaderboardsHighScore
            longestGames={longestGames}
          />
        </div>
      )}
    </main>
  );
}

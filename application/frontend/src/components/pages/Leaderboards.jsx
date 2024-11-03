import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";

export default function Leaderboards() {
  const [leaderboardsSolo, setLeaderboardsSolo] = useState([]);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const soloResponse = await axios.get(`${HOST_PATH}/games?leaderboards_solo=true`);
        const versusResponse = await axios.get(`${HOST_PATH}/games?leaderboards_versus=true`);

        setLeaderboardsSolo(soloResponse.data ? soloResponse.data : []);
        setLeaderboardsVersus(versusResponse.data ? versusResponse.data : []);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="main-default main-leaderboards">
      <article className="leaderboards-solo">
        <h2>Leaderboards</h2>
        {leaderboardsSolo.length > 0 ? (
          <ul>
            {leaderboardsSolo.map((game, index) => (
              <li key={index}>
                Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
                {game.player_two_score || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No solo leaderboard available.</p>
        )}
      </article>
      <article className="leaderboards-versus">
        <h2>Leaderboards</h2>
        {leaderboardsVersus.length > 0 ? (
          <ul>
            {leaderboardsVersus.map((game, index) => (
              <li key={index}>
                Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
                {game.player_two_score || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No solo leaderboard available.</p>
        )}
      </article>
    </main>
  );
}

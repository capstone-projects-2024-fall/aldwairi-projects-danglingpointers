import axios from "axios";
import { useEffect, useState } from "react";

export default function Leaderboards() {
  const [leaderboardsSolo, setLeaderboardsSolo] = useState([]);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState([]);
  const [leaderboardsHighScore, setLeaderboardsHighScore] = useState([]);
  const [leaderboardsHighTime, setLeaderboardsHighTime] = useState([]);
  const HOST_PATH = "http://localhost:8000/api";

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const soloResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_solo=true`
        );
        const versusResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_versus=true`
        );
        const highScoreResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_highscore=true`
        );
        const highTimeResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_hightime=true`
        );

        setLeaderboardsSolo(soloResponse.data || []);
        setLeaderboardsVersus(versusResponse.data || []);

        const highScores = [];
        (highScoreResponse.data || []).forEach((game) => {
          if (game.player_one_score)
            highScores.push({ ...game, score: game.player_one_score });
          if (game.player_two_score)
            highScores.push({ ...game, score: game.player_two_score });
        });
        highScores.sort((a, b) => b.score - a.score);
        setLeaderboardsHighScore(highScores);

        const sortedHighTime = (highTimeResponse.data || []).sort(
          (a, b) => b.game_length - a.game_length
        );
        setLeaderboardsHighTime(sortedHighTime);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  return (
    <main className="main-default">
      <h2>Leaderboards</h2>
      <div className="leaderboards-container">
        <article className="leaderboards-article">
          <h3>Solo Leaderboard</h3>
          <section className="solo-leaderboards default-scrollbar">
            {leaderboardsSolo.length > 0 ? (
              <ul className="max-height">
                {leaderboardsSolo.map((game, index) => (
                  <li key={index}>
                    Score: {game.player_one_score}, Date:{" "}
                    {formatDate(game.date)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No solo leaderboard available.</p>
            )}
          </section>
        </article>

        <article className="leaderboards-article">
          <h3>Versus Leaderboard</h3>
          <section className="versus-leaderboards default-scrollbar">
            {leaderboardsVersus.length > 0 ? (
              <ul className="max-height">
                {leaderboardsVersus.map((game, index) => (
                  <li key={index}>
                    Mode: {game.mode}, Game: {game.id}, Length:{" "}
                    {game.game_length}, Score: {game.player_one_score} vs{" "}
                    {game.player_two_score || "N/A"}, Date:{" "}
                    {formatDate(game.date)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No versus leaderboard available.</p>
            )}
          </section>
        </article>

        <article className="leaderboards-article">
          <h3>High Score Leaderboard</h3>
          <section className="high-score-leaderboard default-scrollbar">
            {leaderboardsHighScore.length > 0 ? (
              <ul className="max-height">
                {leaderboardsHighScore.map((game, index) => (
                  <li key={index}>
                    Mode: {game.mode}, Game: {game.id}, High Score: {game.score}
                    , Date: {formatDate(game.date)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No high score leaderboard available.</p>
            )}
          </section>
        </article>

        <article className="leaderboards-article">
          <h3>High Time Leaderboard</h3>
          <section className="high-time-leaderboards default-scrollbar">
            {leaderboardsHighTime.length > 0 ? (
              <ul className="max-height">
                {leaderboardsHighTime.map((game, index) => (
                  <li key={index}>
                    Game: {game.id}, High Time: {game.game_length}, Date:{" "}
                    {formatDate(game.date)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No high time leaderboard available.</p>
            )}
          </section>
        </article>
      </div>
    </main>
  );
}

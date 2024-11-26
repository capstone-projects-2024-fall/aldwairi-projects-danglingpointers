import axios from "axios";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";
import Loading from "../Loading";
import LeaderboardsHighScore from "../views/LeaderboardsHighScore";
import LeaderboardsSolo from "../views/LeaderboardsSolo";
import LeaderboardsVersus from "../views/LeaderboardsVersus";

export default function Leaderboards() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardsSolo, setLeaderboardsSolo] = useState(null);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState(null);
  const [leaderboardsHighScore, setLeaderboardsHighScore] = useState(null);

  // Fetch data for the leaderboards
  const fetchGames = async () => {
    try {
      const [soloResponse, versusResponse, highScoreResponse] = await Promise.all([
        axios.get(`${HOST_PATH}/games?leaderboards_solo=true`),
        axios.get(`${HOST_PATH}/games?leaderboards_versus=true`),
        axios.get(`${HOST_PATH}/games?leaderboards_highscore=true`),
      ]);

      setLeaderboardsSolo(soloResponse.data);
      setLeaderboardsVersus(versusResponse.data);

      const highScores = [];
      highScoreResponse.data
        .filter((x) => x.status === "Complete")
        .slice(0, 50)
        .forEach((game) => {
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

  useEffect(() => {
    fetchGames();
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket(`ws://localhost:8000/ws/game-server/`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received WebSocket message:", message);

        // Handle updates from the WebSocket
        if (message.type === "game" && message.payload) {
          const updatedGame = message.payload;

          // Update solo leaderboard
          if (leaderboardsSolo) {
            setLeaderboardsSolo((prev) =>
              prev.map((game) =>
                game.id === updatedGame.id ? { ...game, ...updatedGame } : game
              )
            );
          }

          // Update versus leaderboard
          if (leaderboardsVersus) {
            setLeaderboardsVersus((prev) =>
              prev.map((game) =>
                game.id === updatedGame.id ? { ...game, ...updatedGame } : game
              )
            );
          }

          // Update high scores leaderboard
          if (leaderboardsHighScore) {
            setLeaderboardsHighScore((prev) => {
              const updatedHighScores = prev.map((game) =>
                game.id === updatedGame.id
                  ? { ...game, score: Math.max(updatedGame.player_one_score || 0, updatedGame.player_two_score || 0) }
                  : game
              );
              updatedHighScores.sort((a, b) => b.score - a.score); // Re-sort after updates
              return updatedHighScores;
            });
          }
        }
      };

      ws.onclose = () => {
        console.warn("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [leaderboardsSolo, leaderboardsVersus, leaderboardsHighScore]);

  return (
    <main className="leaderboards-default">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="leaderboards-container">
          <LeaderboardsSolo leaderboardsSolo={leaderboardsSolo} />
          <LeaderboardsVersus leaderboardsVersus={leaderboardsVersus} />
          <LeaderboardsHighScore leaderboardsHighScore={leaderboardsHighScore} />
        </div>
      )}
    </main>
  );
}

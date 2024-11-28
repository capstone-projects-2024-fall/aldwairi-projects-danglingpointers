import axios from "axios";
import LeaderboardsVersus from "../views/LeaderboardsVersus";
import LeaderboardsLongestGames from "../views/LeaderboardsLongestGames";
import LeaderboardsSolo from "../views/LeaderboardsSolo";
import { useEffect, useState } from "react";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";
import Loading from "../Loading";

export default function Leaderboards() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardsSolo, setLeaderboardsSolo] = useState(null);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState(null);
  const [longestGames, setLongestGames] = useState(null);

  // Fetch data for the leaderboards
  const fetchGames = async () => {
    try {
      const [soloResponse, versusResponse, longestGamesResponse] =
        await Promise.all([
          axios.get(`${HOST_PATH}/games?leaderboards_solo=true`),
          axios.get(`${HOST_PATH}/games?leaderboards_versus=true`),
          axios.get(`${HOST_PATH}/games?longest_games=true`),
        ]);

      setLeaderboardsSolo(soloResponse.data);
      setLeaderboardsVersus(versusResponse.data);
      setLongestGames(longestGamesResponse.data);

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
      ws = new WebSocket(GAME_URL);

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

          // Update longest games leaderboard
          if (longestGames) {
            setLongestGames((prev) => {
              const updatedLongestGames = prev.map((game) =>
                game.id === updatedGame.id
                  ? {
                      ...game,
                      score: Math.max(
                        updatedGame.player_one_score || 0,
                        updatedGame.player_two_score || 0
                      ),
                    }
                  : game
              );
              return updatedLongestGames;
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
  }, [leaderboardsSolo, leaderboardsVersus, longestGames]);

  return (
    <main className="leaderboards-default">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="leaderboards-container">
          <LeaderboardsSolo leaderboardsSolo={leaderboardsSolo} />
          <LeaderboardsVersus leaderboardsVersus={leaderboardsVersus} />
          <LeaderboardsLongestGames longestGames={longestGames} />
        </div>
      )}
    </main>
  );
}

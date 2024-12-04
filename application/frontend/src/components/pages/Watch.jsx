import { useEffect, useState } from "react";
import axios from "axios";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";
import WatchSolo from "../views/WatchSolo";
import WatchVersus from "../views/WatchVersus";
import WatchHighScore from "../views/WatchHighScore";
import Loading from "../Loading";

export default function Watch() {
  const [isLoading, setIsLoading] = useState(true);
  const [watchSoloGames, setWatchSoloGames] = useState([]);
  const [watchVersusGames, setWatchVersusGames] = useState([]);
  const [watchHighScoreGames, setWatchHighScoreGames] = useState([]);

  // Fetch initial data
  const fetchGames = async () => {
    try {
      const [soloResponse, versusResponse, highScoreResponse] = await Promise.all([
        axios.get(`${HOST_PATH}/games?watch=true&solo=true`),
        axios.get(`${HOST_PATH}/games?watch=true&versus=true`),
        axios.get(`${HOST_PATH}/games?watch=true&high_score=true`),
      ]);

      setWatchSoloGames(soloResponse.data);
      setWatchVersusGames(versusResponse.data);
      setWatchHighScoreGames(highScoreResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching games data:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // WebSocket connection
  useEffect(() => {
    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket(GAME_URL);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === "game" && message.payload) {
          const updatedGame = message.payload;

          // Update solo games
          setWatchSoloGames(prev => 
            prev.map(game => 
              game.id === updatedGame.id ? { ...game, ...updatedGame } : game
            )
          );

          // Update versus games
          setWatchVersusGames(prev => 
            prev.map(game => 
              game.id === updatedGame.id ? { ...game, ...updatedGame } : game
            )
          );

          // Update high score games
          setWatchHighScoreGames(prev => 
            prev.map(game => 
              game.id === updatedGame.id ? { ...game, ...updatedGame } : game
            )
          );
        }
      };

      ws.onclose = () => {
        console.warn("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <main className="watchlists-default">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="watchlists-container">
          <WatchSolo watchSoloGames={watchSoloGames} />
          <WatchVersus watchVersusGames={watchVersusGames} />
          <WatchHighScore watchHighScoreGames={watchHighScoreGames} />
        </div>
      )}
    </main>
  );
}

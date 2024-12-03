import { useEffect, useState } from "react";
import axios from "axios";
import Watchlist from "../views/Watchlist";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";


export default function Watch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchWatchlist = async () => {
      try {
        await axios.get(`${HOST_PATH}/api/watchlist`);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load watchlist');
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  // Game Socket
  useEffect(() => {
    const ws = new WebSocket(GAME_URL);

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game") {
        console.log("Received game message:", message);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection to GameConsumer closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <main className="main-default main-watch">
      <article className="watch-container">
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="loading">Loading watchlist...</div>
        ) : (
          <Watchlist />
        )}
      </article>
    </main>
  );
}

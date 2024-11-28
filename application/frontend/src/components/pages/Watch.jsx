import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";

export default function Watch() {
  const [watchGames, setWatchGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const watchResponse = await axios.get(`${HOST_PATH}/games?watch=true`);

        setWatchGames(watchResponse.data ? watchResponse.data : []);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  // Game Socket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/game-server/`);

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
      <article className="watch-games default-scrollbar">
        <h2>Watch</h2>
        {watchGames.length > 0 ? (
          <ul className="max-height">
            {watchGames.map((game, index) => (
              <li key={index}>
                Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
                {game.player_two_score || "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No active games available.</p>
        )}
      </article>
    </main>
  );
}

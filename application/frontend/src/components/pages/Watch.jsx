import { useEffect, useState } from "react";
import axios from "axios";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";
import WatchSolo from "../views/WatchSolo";
import WatchVersus from "../views/WatchVersus";
import WatchHighScore from "../views/WatchHighScore";

export default function Watch() {
  const [watchSoloGames, setWatchSoloGames] = useState([]);
  const [watchVersusGames, setWatchVersusGames] = useState([]);
  const [watchHighScoreGames, setWatchHighScoreGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const watchSoloResponse = await axios.get(
          `${HOST_PATH}/games?watch=true&solo=true`
        );
        const watchVersusResponse = await axios.get(
          `${HOST_PATH}/games?watch=true&versus=true`
        );
        const watchHighScoreResponse = await axios.get(
          `${HOST_PATH}/games?watch=true&high_score=true`
        );

        setWatchSoloGames(watchSoloResponse.data ? watchSoloResponse.data : []);
        setWatchVersusGames(
          watchVersusResponse.data ? watchVersusResponse.data : []
        );
        setWatchHighScoreGames(
          watchHighScoreResponse.data ? watchHighScoreResponse.data : []
        );
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };
    fetchGames();
  }, []);

  // Game Socket
  useEffect(() => {
    const fetchGame = async (gameId) => {
      try {
        const gameResponse = await axios.get(
          `${HOST_PATH}/games/?game_id=${gameId}`
        );
        const data = gameResponse.data[0];

        if (data.status === "Active") {
          if (data.mode === "Solo") {
            const newSoloGames = watchSoloGames;
            newSoloGames.unshift(data);
            setWatchSoloGames(newSoloGames);
          } else {
            setWatchVersusGames([data, ...watchVersusGames]);
          }
        } else if (data.status === "Complete") {
          if (data.mode === "Solo") {
            const newSoloGames = watchSoloGames;
            setWatchSoloGames(newSoloGames.filter((x) => x.id !== data.id));
          } else {
            setWatchVersusGames([data, ...watchVersusGames]);
          }
        }

        const highScoreResponse = await axios.get(
          `${HOST_PATH}/games?watch=true&high_score=true`
        );

        setWatchHighScoreGames(highScoreResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    const ws = new WebSocket(GAME_URL);

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game") {
        console.log("Received game message:", message);
        fetchGame(message.game_id);
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
  }, [watchSoloGames, watchVersusGames]);

  return (
    <main className="main-default main-watch">
      <div className="watch-games default-scrollbar">
        <h2>Watch</h2>
        <div className="watch-grid">
          <WatchSolo watchSoloGames={watchSoloGames} />
          <WatchVersus watchVersusGames={watchVersusGames} />
          <WatchHighScore watchHighScoreGames={watchHighScoreGames} />
        </div>
      </div>
    </main>
  );
}

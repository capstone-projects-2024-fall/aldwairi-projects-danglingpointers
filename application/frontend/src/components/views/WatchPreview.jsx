import { useEffect } from "react";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";
import axios from "axios";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";

export default function WatchPreview({ id, watchGames, setWatchGames }) {
  useEffect(() => {
    const fetchGame = async (gameId) => {
      try {
        const gameResponse = await axios.get(
          `${HOST_PATH}/games/?game_id=${gameId}`
        );
        const data = gameResponse.data[0];

        const match = watchGames.find((x) => x.id === data.id);

        if (data.status === "Active" && !match) {
          setWatchGames([data, ...watchGames]);
        } else if (data.status === "Complete") {
          const newGames = watchGames;
          setWatchGames(newGames.filter((x) => x.id !== data.id));
        }
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
        const gid = message.game_id.toString();
        if (gid.includes("_")) {
          const parts = message.game_id.split("_");
          const socketGameId = parts[0];
          fetchGame(socketGameId);
        } else {
          fetchGame(gid);
        }
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
  }, [watchGames, setWatchGames]);

  return (
    <article id={id} className="default-scrollbar">
      <div className="preview">
        <div className="link-flex">
          <Link to="/watch">
            <h2>Watch</h2>
          </Link>
          <span></span>
        </div>
        {watchGames.length > 0 ? (
          <ul>
            {watchGames.map((game, index) => (
              <GameEntry
                key={index}
                gameLength={game.game_length}
                users={[
                  { id: game.player_one, name: "" },
                  { id: game.player_two, name: "" },
                ]}
                status={game.status}
                gameId={game.id}
                mode={game.mode}
                scores={[game.player_one_score, game.player_two_score]}
              />
            ))}
          </ul>
        ) : (
          <p>No pending games available.</p>
        )}
        <Link to="/watch">
          <p>View more games in progress</p>
        </Link>
      </div>
    </article>
  );
}

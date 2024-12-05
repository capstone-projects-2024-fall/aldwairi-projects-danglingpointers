import axios from "axios";
import { useEffect } from "react";
import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";

export default function LeaderboardsPreview({
  leaderboardsSolo,
  setLeaderboardsSolo,
  leaderboardsVersus,
  setLeaderboardsVersus,
}) {
  useEffect(() => {
    const fetchGame = async (gameId) => {
      try {
        const gameResponse = await axios.get(
          `${HOST_PATH}/games/?game_id=${gameId}`
        );

        const data = gameResponse.data[0];

        // let match;
        // if (data.mode === "Solo") {
        //   match = leaderboardsSolo.find((x) => x.id === data.id);
        // } else {
        //   match = leaderboardsVersus.find((x) => x.id === data.id);
        // }

        // if (data.status === "Complete" && !match) {
        if (data.status === "Complete") {
          data.mode === "Solo"
            ? setLeaderboardsSolo([data, ...leaderboardsSolo])
            : setLeaderboardsVersus([data, ...leaderboardsVersus]);
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
  }, [
    leaderboardsSolo,
    setLeaderboardsSolo,
    leaderboardsVersus,
    setLeaderboardsVersus,
  ]);

  return (
    <article className="leaderboards-preview-container default-scrollbar">
      <div className="leaderboards-preview preview">
        <div className="link-flex">
          <Link to="/leaderboards">
            <h2>Solo Leaderboards</h2>
          </Link>
          <span></span>
        </div>
        {leaderboardsSolo ? (
          <ul>
            {leaderboardsSolo.map((game, index) => (
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
          <p>No solo leaderboards available.</p>
        )}
      </div>
      <div className="leaderboards-preview preview">
        <div className="link-flex">
          <Link to="/leaderboards">
            <h2>Versus Leaderboards</h2>
          </Link>
          <span></span>
        </div>
        {leaderboardsVersus ? (
          <ul>
            {leaderboardsVersus.map((game, index) => (
              <GameEntry
                key={index}
                users={[
                  { id: game.player_one, name: "" },
                  { id: game.player_two, name: "" },
                ]}
                gameId={game.id}
                status={game.status}
                scores={[game.player_one_score, game.player_two_score]}
              />
            ))}
          </ul>
        ) : (
          <p>No solo leaderboards available.</p>
        )}
      </div>
    </article>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import useUserAuthStore from "../../stores/userAuthStore";
import CreateGameEntry from "../entries/CreateGameEntry";
import GameEntry from "../entries/GameEntry";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";

export default function LobbyPreview({ id, lobbyGames, setLobbyGames }) {
  const [isCreateGame, setIsCreateGame] = useState(false);
  const { isLoggedIn } = useUserAuthStore();
  const handleCreateGame = async () => {
    const games = lobbyGames;
    const newGame = {
      status: "Create",
    };
    if (isCreateGame) {
      games.shift();
    } else {
      games.unshift(newGame);
      setLobbyGames(games);
    }

    setIsCreateGame(!isCreateGame);
  };

  useEffect(() => {
    const fetchGame = async (gameId) => {
      try {
        const gameResponse = await axios.get(
          `${HOST_PATH}/games/?game_id=${gameId}`
        );
        const data = gameResponse.data[0];

        const match = lobbyGames.find((x) => x.id === data.id);
        console.log(match);

        if (data.status === "Pending" && !match) {
          setLobbyGames([data, ...lobbyGames]);
        } else if (data.status === "Active") {
          const newGames = lobbyGames;
          setLobbyGames(newGames.filter((x) => x.id !== data.id));
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
  }, [lobbyGames, setLobbyGames]);

  return (
    <article id={id} className="default-scrollbar">
      <div className="preview">
        <div className="link-flex">
          <h2>Lobby</h2>
          {isLoggedIn && (
            <button
              className="btn-create-game-modal"
              onClick={handleCreateGame}
              style={{ background: isCreateGame ? "yellow" : "white" }}
            >
              {isCreateGame ? "Cancel" : "Create Versus Game"}
            </button>
          )}
        </div>
        {lobbyGames.length > 0 ? (
          <ul>
            {lobbyGames.map((game, index) =>
              game.status === "Create" ? (
                <CreateGameEntry
                  key={index}
                  status={game.status}
                  setIsCreateGame={setIsCreateGame}
                  lobbyGames={lobbyGames}
                  setLobbyGames={setLobbyGames}
                />
              ) : (
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
              )
            )}
          </ul>
        ) : (
          <p>No pending games available.</p>
        )}
      </div>
    </article>
  );
}

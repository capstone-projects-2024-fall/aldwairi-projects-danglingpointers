import { useState } from "react";
import GameEntry from "../entries/GameEntry";
import useUserAuthStore from "../../stores/userAuthStore";
import CreateGameEntry from "../entries/CreateGameEntry";

export default function LobbyPreview({ lobbyGames, setLobbyGames }) {
  const [isCreateGame, setIsCreateGame] = useState(false);
  const { isLoggedIn, username } = useUserAuthStore();
  const handleCreateGame = async () => {
    const games = lobbyGames;
    const newGame = {
      player_one: username,
      player_two: null,
      status: "Create",
      mode: "Versus",
    };
    if (isCreateGame) {
      games.pop();
    } else {
      games.unshift(newGame);
      setLobbyGames(games);
    }

    setIsCreateGame(!isCreateGame);
  };

  // const handlePostGame = async () => {
  //   if (!isCreateGame) return;

  //   setIsCreateGame(false);
  // };

  return (
    <article className="default-scrollbar">
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
                <CreateGameEntry key={index} status={game.status} />
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

import useUserAuthStore from "../../stores/userAuthStore";
import GameEntry from "../entries/GameEntry";

export default function LobbyPreview({ lobbyGames, setIsCreateGame }) {
  const { isLoggedIn } = useUserAuthStore();

  return (
    <article className="default-scrollbar">
      <div className="preview">
        <div className="link-flex">
          <h2>Lobby</h2>
          {isLoggedIn && (
            <button
              className="btn-create-game-modal"
              onClick={() => setIsCreateGame(true)}
            >
              Create Versus Game
            </button>
          )}
        </div>
        {lobbyGames.length > 0 ? (
          <ul>
            {lobbyGames.map((game, index) => (
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
      </div>
    </article>
  );
}

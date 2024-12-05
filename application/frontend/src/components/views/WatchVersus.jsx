import GameEntry from "../entries/GameEntry";

export default function WatchVersus({ watchVersusGames }) {
  return (
    <article className="default-scrollbar">
      <div className="watchlist">
        <div className="link-flex">
          <h2>Watch Versus Games</h2>
          <span></span>
        </div>
        {watchVersusGames.length > 0 ? (
          <ul className="games-list">
            {watchVersusGames.map((game, index) => (
              <GameEntry
                key={game.id || index}
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
          <p className="no-games">No active versus games available.</p>
        )}
      </div>
    </article>
  );
}

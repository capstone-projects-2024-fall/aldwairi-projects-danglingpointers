import GameEntry from "../entries/GameEntry";

export default function WatchSolo({ watchSoloGames }) {
  return (
    <article className="default-scrollbar">
      <div id ="solo-watchlist"className="watchlist">
        <div className="link-flex">
          <h2>Watch Solo Games</h2>
          <span></span>
        </div>
        {watchSoloGames.length > 0 ? (
          <ul className="games-list">
            {watchSoloGames.map((game, index) => (
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
          <p className="no-games">No active solo games available.</p>
        )}
      </div>
    </article>
  );
}

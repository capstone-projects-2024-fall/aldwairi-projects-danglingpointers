import GameEntry from "../entries/GameEntry";

export default function WatchHighScore({ watchHighScoreGames }) {
  return (
    <div>
      <h2>Watch High Score Games</h2>
      {watchHighScoreGames.length > 0 ? (
        <ul className="max-height">
          {watchHighScoreGames.map((game, index) => (
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
        <p>No active games available.</p>
      )}
    </div>
  );
}

import GameEntry from "../entries/GameEntry";

export default function WatchVersus({ watchVersusGames }) {
  return (
    <div>
      <h2>Watch Versus Games</h2>
      {watchVersusGames.length > 0 ? (
        <ul className="max-height">
          {watchVersusGames.map((game, index) => (
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
        <p>No active versus games available.</p>
      )}
    </div>
  );
}

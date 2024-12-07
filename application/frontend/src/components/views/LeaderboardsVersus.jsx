import GameEntry from "../entries/GameEntry";

export default function LeaderboardsVersus({ leaderboardsVersus }) {
  return (
    <article id= "verus-leaderboard" className="default-scrollbar">
      <div className="leaderboard">
        <div className="link-flex">
          <h2>Versus Leaderboards</h2>
          <span></span>
        </div>
        {leaderboardsVersus ? (
          <ul>
            {leaderboardsVersus.map((game, index) => (
              <GameEntry
                key={index}
                gameLength={game.game_length}
                gameId={game.id}
                users={[
                  { id: game.player_one, name: "" },
                  { id: game.player_two, name: "" },
                ]}
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

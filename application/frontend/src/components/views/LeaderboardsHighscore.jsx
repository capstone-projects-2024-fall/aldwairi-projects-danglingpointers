import GameEntry from "../entries/GameEntry";

export default function LeaderboardsHighScore({ leaderboardsHighScore }) {
  return (
    <article className="default-scrollbar">
      <div className="leaderboard">
        <div className="link-flex">
          <h2>Highscore Leaderboards</h2>
          <span></span>
        </div>
        {leaderboardsHighScore ? (
          <ul>
            {leaderboardsHighScore.map((game, index) => (
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

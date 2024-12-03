import GameEntry from "../entries/GameEntry";

export default function LeaderboardsSolo({ leaderboardsSolo }) {
  return (
    <article className="default-scrollbar">
      <div className="leaderboard">
        <div className="link-flex">
          <h2>Solo Leaderboards</h2>
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
                gameLink={game.link}
                mode={game.mode}
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

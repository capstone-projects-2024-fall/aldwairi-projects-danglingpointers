import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LeaderboardsVersus({ leaderboardsVersus }) {
  return (
    <article className="default-scrollbar">
      <div className="leaderboard">
        <div className="link-flex">
          <Link to="/leaderboards">
            <h2>Versus Leaderboards</h2>
          </Link>
          <span></span>
        </div>
        {leaderboardsVersus ? (
          <ul>
            {leaderboardsVersus.map((game, index) => (
              <GameEntry
                key={index}
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

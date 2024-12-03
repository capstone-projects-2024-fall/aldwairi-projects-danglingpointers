import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function LeaderboardsPreview({ leaderboardsSolo, leaderboardsVersus }) {
  return (
    <article className="leaderboards-preview-container default-scrollbar">
      <div className="leaderboards-preview preview">
        <div className="link-flex">
          <Link to="/leaderboards">
            <h2>Solo Leaderboards</h2>
          </Link>
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
                gameId={game.id}
                mode={game.mode}
                scores={[game.player_one_score, game.player_two_score]}
              />
            ))}
          </ul>
        ) : (
          <p>No solo leaderboards available.</p>
        )}
      </div>
      <div className="leaderboards-preview preview">
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

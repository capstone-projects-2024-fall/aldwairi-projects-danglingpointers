import GameEntry from "../entries/GameEntry";
import { Link } from "react-router-dom";

export default function WatchPreview({ watchGames }) {
  return (
    <article className="default-scrollbar">
      <div className="preview">
        <div className="link-flex">
          <Link to="/watch">
            <h2>Watch</h2>
          </Link>
          <span></span>
        </div>
        {watchGames.length > 0 ? (
          <ul>
            {watchGames.map((game, index) => (
              <GameEntry
                key={index}
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
        <Link to="/watch">
          <p>View more games in progress</p>
        </Link>
      </div>
    </article>
  );
}

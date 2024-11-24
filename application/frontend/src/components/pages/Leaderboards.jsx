import LeaderboardsVersus from "../views/LeaderboardsVersus";
import LeaderboardsHighScore from "../views/LeaderboardsHighscore";
import LeaderboardsSolo from "../views/LeaderboardsSolo";

export default function Leaderboards() {
  return (
    <main className="leaderboards-default">
      <div className="leaderboards-container">
        <LeaderboardsSolo />
        <LeaderboardsVersus />
        <LeaderboardsHighScore />
      </div>
    </main>
  );
}

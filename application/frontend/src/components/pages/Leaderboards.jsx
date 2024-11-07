import LeaderboardsVersus from "../views/LeaderboardsVersus"
import LeaderboardsHighScore from "../views/LeaderboardsHighscore"
import LeaderboardsSolo from "../views/LeaderboardsSolo";

export default function Leaderboards() {
    return (
        <main className="leaderboards-default">
            <h2>Leaderboards</h2>
            <div className="leaderboards-container">
                <LeaderboardsSolo />
                <LeaderboardsVersus /> 
                <LeaderboardsHighScore />      
            </div>
        </main>
    );
}

import LeaderboardsPreview from "../views/LeaderboardsPreview";
import LobbyPreview from "../views/LobbyPreview";
import WatchPreview from "../views/WatchPreview";

export default function Home() {
  return (
    <main className="main-home">
      <div className="preview-container">
        <LeaderboardsPreview />
        <LobbyPreview />
        <WatchPreview />
      </div>
    </main>
  );
}

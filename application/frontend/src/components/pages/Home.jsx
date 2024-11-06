import LeaderboardsPreview from "../previews/LeaderboardsPreview";
import LobbyPreview from "../previews/LobbyPreview";
import WatchPreview from "../previews/WatchPreview";

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

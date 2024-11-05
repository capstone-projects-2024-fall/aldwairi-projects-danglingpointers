import LobbyPreview from "../previews/LobbyPreview"
import WatchPreview from "../previews/WatchPreview"

export default function Home() {
  return (
    <main className="main-home">
      <div className="preview-container">
         <LobbyPreview />
         <WatchPreview />
      </div>
    </main>
  );
}

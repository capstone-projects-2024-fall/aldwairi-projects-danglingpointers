import LeaderboardsPreview from "../views/LeaderboardsPreview";
import LobbyPreview from "../views/LobbyPreview";
import WatchPreview from "../views/WatchPreview";
// import { GAME_URL } from "../../scripts/constants";
// import { useEffect, useState } from "react";

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

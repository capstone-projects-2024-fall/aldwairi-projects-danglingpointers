import LeaderboardsPreview from "../views/LeaderboardsPreview";
import LobbyPreview from "../views/LobbyPreview";
import WatchPreview from "../views/WatchPreview";
import { GAME_URL } from "../../scripts/constants";
import { useEffect, useState } from "react";

export default function Home() {
  const [gameSocket, setGameSocket] = useState(null);
  // const [gameId, setGameId] = useState(null);
  
  useEffect(() => {
    setGameSocket(new WebSocket(GAME_URL));

    gameSocket.onopen = () => {
      console.log("Connected to game server");
    };

    gameSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "game") {
        console.log(`${data.game_id} completed!`);
      }
    };

    return () => {
      if (gameSocket) {
        gameSocket.close();
      }
    };

  }, [gameSocket])

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

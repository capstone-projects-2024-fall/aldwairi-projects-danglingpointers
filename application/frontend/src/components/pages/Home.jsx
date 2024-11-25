import { useEffect, useState } from "react";
import LeaderboardsPreview from "../views/LeaderboardsPreview";
import LobbyPreview from "../views/LobbyPreview";
import WatchPreview from "../views/WatchPreview";
import Loading from "../Loading";
import { HOST_PATH } from "../../scripts/constants";
import axios from "axios";
import CreateGameModal from "../CreateGameModal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateGame, setIsCreateGame] = useState(false);
  const [leaderboardsSolo, setLeaderboardsSolo] = useState(null);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState(null);
  const [lobbyGames, setLobbyGames] = useState(null);
  const [watchGames, setWatchGames] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const soloResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_solo=true&preview=true`
        );
        const versusResponse = await axios.get(
          `${HOST_PATH}/games?leaderboards_versus=true&preview=true`
        );
        const lobbyResponse = await axios.get(
          `${HOST_PATH}/games?lobby=true&preview=true`
        );
        const watchResponse = await axios.get(
          `${HOST_PATH}/games?watch=true&preview=true`
        );

        setLeaderboardsSolo(soloResponse.data.slice(0, 10) || []);
        setLeaderboardsVersus(versusResponse.data.slice(0, 10) || []);
        setLobbyGames(lobbyResponse.data.slice(0, 10));
        setWatchGames(
          watchResponse.data ? watchResponse.data.slice(0, 10) : []
        );
        // sleep()
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching games data:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="main-home">
      {isLoading ? (
        <Loading />
      ) : isCreateGame ? 
      <CreateGameModal setIsCreateGame={setIsCreateGame}/>: (
        <div className="preview-container">
          <LeaderboardsPreview
            leaderboardsSolo={leaderboardsSolo}
            leaderboardsVersus={leaderboardsVersus}
          />
          <LobbyPreview lobbyGames={lobbyGames} setIsCreateGame={setIsCreateGame}/>
          <WatchPreview watchGames={watchGames} />
        </div>
      )}
    </main>
  );
}

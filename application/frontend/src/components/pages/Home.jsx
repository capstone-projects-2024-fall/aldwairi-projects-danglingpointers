import axios from "axios";
import { useEffect, useState } from "react";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";
import CreateGameModal from "../CreateGameModal";
import Loading from "../Loading";
import LeaderboardsPreview from "../views/LeaderboardsPreview";
import LobbyPreview from "../views/LobbyPreview";
import WatchPreview from "../views/WatchPreview";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateGame, setIsCreateGame] = useState(false);
  const [leaderboardsSolo, setLeaderboardsSolo] = useState(null);
  const [leaderboardsVersus, setLeaderboardsVersus] = useState(null);
  const [lobbyGames, setLobbyGames] = useState([]);
  const [watchGames, setWatchGames] = useState([]);
  
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

  useEffect(() => {
    const fetchGame = async (gameId) => {
      try {
        const gameResponse = await axios.get(
          `${HOST_PATH}/games/?game_id=${gameId}`
        );
        const data = gameResponse.data[0];
        
        if (data.status === "Active") {
          if (data.mode === "Solo") {
            const newGames = watchGames;
            newGames.unshift(data);
            setWatchGames(newGames);
          } 
          // else {
          //   setWatchVersusGames();
          // }
        } else if (data.status === "Complete") {
          if (data.mode === "Solo") {
            const newGames = watchGames;
            setWatchGames(newGames.filter((x) => x.id !== data.id));
          } 
          // else {
          //   setWatchVersusGames();
          // }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const ws = new WebSocket(GAME_URL);

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game") {
        console.log("Received game message:", message);
        fetchGame(message.game_id)        
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection to GameConsumer closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, [watchGames]);

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

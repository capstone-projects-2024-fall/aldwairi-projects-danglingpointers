import axios from "axios";
import { useEffect, useState } from "react";
import Inbox from "../dashboard-components/Inbox"
import Store from "../dashboard-components/Store";
import Settings from "../dashboard-components/Settings";
// import UserLeaderboards from "../dashboard-components/UserLeaderboards";
import UserPreviousGames from "../dashboard-components/UserPreviousGames";
import UserSetup from "../dashboard-components/UserSetup";
// import UserStats from "../dashboard-components/UserStats";
import { HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";

export default function Dashboard() {
  const { userId } = useUserAuthStore();
  const [userNeedsMetaData, setUserNeedsMetaData] = useState(true);

  useEffect(() => {
    const fetchUserMetaData = async () => {
      try {
        const metadataResponse = await axios.get(
          `${HOST_PATH}/user-metadata?user_id=${userId}`
        );

        if (metadataResponse.data.length) setUserNeedsMetaData(false);
        else setUserNeedsMetaData(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserMetaData();
  }, [userId]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/game-server/`);
  
    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game") {
        console.log("Received game message:", message);
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
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat-server/`);
  
    ws.onopen = () => {
      console.log("WebSocket connection to ChatConsumer established");
    };
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        console.log("Received chat message:", message);
      }
    };
  
    ws.onclose = () => {
      console.log("WebSocket connection to ChatConsumer closed");
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return () => {
      ws.close();
    };
  }, []);

  if (userNeedsMetaData) {
    return <UserSetup setUserNeedsMetaData={setUserNeedsMetaData} />;
  }
  return (
    <main className="main-dashboard">
      <Inbox />
      <Store />
      <Settings />
      {/* <UserLeaderboards /> */}
      <UserPreviousGames />
      {/* <UserStats /> */}
    </main>
  );
}

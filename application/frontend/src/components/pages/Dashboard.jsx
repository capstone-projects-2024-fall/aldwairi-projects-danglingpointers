import { useEffect, useState } from "react";
import Inbox from "../dashboard-components/Inbox";
import Store from "../dashboard-components/Store";
import Settings from "../dashboard-components/Settings";
import UserPreviousGames from "../dashboard-components/UserPreviousGames";
import UserSetup from "../dashboard-components/UserSetup";
import useUserAuthStore from "../../stores/userAuthStore";
import useUserMetaDataStore from "../../stores/userMetaDataStore";

export default function Dashboard() {
  const { userId } = useUserAuthStore();
  const { isMetaDataSet, setUserMetaData } = useUserMetaDataStore();
  const [userNeedsMetaData, setUserNeedsMetaData] = useState(true);

  useEffect(() => {
    // Returning user logged in
    const fetchUserMetaData = async () => {
      try {
        const formData = {
          userId: userId,
        };
        await setUserMetaData(formData);
        setUserNeedsMetaData(false);
      } catch (error) {
        console.log(error);
      }
    };

    // If not signed in, return
    if (!userId) return;

    console.log(isMetaDataSet);

    // User created and navigating from security question/answer screen
    if (isMetaDataSet) {
      setUserNeedsMetaData(false);
      return;
    }

    fetchUserMetaData();
  }, [userId, isMetaDataSet, setUserMetaData]);

  // Game Socket
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

  // Chat Socket
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
    <main className="main-dashboard default-scrollbar">
      <Inbox />
      <Store />
      <Settings />
      {/* <UserLeaderboards /> */}
      <UserPreviousGames />
      {/* <UserStats /> */}
    </main>
  );
}

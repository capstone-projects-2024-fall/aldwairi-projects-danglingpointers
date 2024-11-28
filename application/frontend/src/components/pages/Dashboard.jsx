import { useEffect, useState } from "react";
import Inbox from "../dashboard-components/Inbox";
import Store from "../dashboard-components/Store";
import Settings from "../dashboard-components/Settings";
import UserPreviousGames from "../dashboard-components/UserPreviousGames";
import UserSetup from "../dashboard-components/UserSetup";
import useUserAuthStore from "../../stores/userAuthStore";
import useUserMetaDataStore from "../../stores/userMetaDataStore";
import { CHAT_URL, GAME_URL } from "../../scripts/constants";

export default function Dashboard() {
  const { userId } = useUserAuthStore();
  const { isMetaDataSet, setUserMetaData } = useUserMetaDataStore();
  const [userNeedsMetaData, setUserNeedsMetaData] = useState(true);

  useEffect(() => {
    // Returning user logged in
    const fetchUserMetaData = async () => {
      console.log("hiii");
      try {
        const formData = {
          user_id: userId,
        };
        await setUserMetaData(formData);
        setUserNeedsMetaData(false);
      } catch (error) {
        console.error(error);
      }
    };

    // If not signed in, return
    if (!userId) return;
    console.log(userId);
    // User created and navigating from security question/answer screen
    if (isMetaDataSet) {
      setUserNeedsMetaData(false);
      console.log("hii");
      return;
    }

    // Metadata not set, need to fetch it
    fetchUserMetaData();
  }, [userId, isMetaDataSet, setUserMetaData]);

  // Game Socket
  useEffect(() => {
    const ws = new WebSocket(GAME_URL);

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
    const ws = new WebSocket(CHAT_URL);

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

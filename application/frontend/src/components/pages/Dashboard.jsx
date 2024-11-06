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

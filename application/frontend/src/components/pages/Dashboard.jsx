import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";
import useUserMetaDataStore from "../../stores/userMetaDataStore";
import Inbox from "../dashboard-components/Inbox";
import Settings from "../dashboard-components/Settings";
import Store from "../dashboard-components/Store";
import UserPreviousGames from "../dashboard-components/UserPreviousGames";
import UserSetup from "../dashboard-components/UserSetup";

export default function Dashboard() {
  const { userId, username } = useUserAuthStore();
  const { isMetaDataSet, setUserMetaData } = useUserMetaDataStore();
  const [userNeedsMetaData, setUserNeedsMetaData] = useState(true);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]); // State for friends

  // Fetch pending friend requests
  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${HOST_PATH}/friendship/`, {
        params: { user_id: userId, status: "Pending", exclude_requestor: true },
      });
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  // Fetch friends list
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${HOST_PATH}/friends/`, {
        params: { user_id: userId }, // Include user_id as a query parameter
      });
      console.log("Friends API Response:", response.data);
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };
  
  const handleAcceptRequest = async (friendshipId) => {
    try {
      console.log("Accepting request for friendshipId:", friendshipId);
      await axios.patch(`${HOST_PATH}/friendship/${friendshipId}/`, {
        status: "Accepted",
      });
      alert("Friend request accepted!");
      fetchPendingRequests(); // Refresh pending requests
      fetchFriends(); // Refresh friends list
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
  
  // Fetch user metadata on mount
  useEffect(() => {
    const fetchUserMetaData = async () => {
      try {
        const formData = {
          user_id: userId,
        };
        await setUserMetaData(formData);
        setUserNeedsMetaData(false);
      } catch (error) {
        console.error("Error fetching user metadata:", error);
      }
    };

    if (!userId) return;

    if (isMetaDataSet) {
      setUserNeedsMetaData(false);
      return;
    }

    fetchUserMetaData();
  }, [userId, isMetaDataSet, setUserMetaData]);

  // Fetch pending requests and friends whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchPendingRequests();
      fetchFriends();
    }
  }, [userId]);

  if (userNeedsMetaData) {
    return <UserSetup setUserNeedsMetaData={setUserNeedsMetaData} />;
  }

  return (

    <main className="main-dashboard default-scrollbar">
       {/* "My Profile" button */}
      <div className="profile-button-container">
        <Link to={`/profile/${username}`}>
          <button className="profile-button">My Profile</button>
        </Link>
      </div>
      <Inbox isInboxOpen={isInboxOpen} setIsInboxOpen={setIsInboxOpen}/>
      <div className="friend-sections" style={isInboxOpen ? {display: "none"}: null}>

        <div className="section pending-requests">
          <h3>Pending Friend Requests</h3>
          {/* Content for pending requests */}
        </div>
        <div className="section friends-list" style={isInboxOpen ? {display: "none"}: null}>
          <h3>Friends</h3>
          {/* Content for friends list */}
        </div>
      </div>
      <Store isInboxOpen={isInboxOpen}/>
      <Settings isInboxOpen={isInboxOpen}/>
      <UserPreviousGames isInboxOpen={isInboxOpen}/>
    </main>
  );
}
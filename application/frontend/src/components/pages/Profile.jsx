import { useEffect, useState } from "react";
import axios from "axios";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";
import useUserAuthStore from "../../stores/userAuthStore";

const Profile = ({ profileUserId, username, dateJoined, lastLogin }) => {
  const [profileData, setProfileData] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const { userId } = useUserAuthStore();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const gamesResponse = await axios.get(
          `${HOST_PATH}/games?recent_games=true&user_id=${userId}`
        );
        const commentsResponse = await axios.get(`${HOST_PATH}/comments?user_id=${userId}`);

        setProfileData({
          username: username,
          dateJoined: dateJoined,
          lastLogin: lastLogin,
        });

        setRecentGames(
          gamesResponse.data.filter((game) => game.status === "Complete") || []
        );
        setComments(commentsResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setUserNotFound(true);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, username, dateJoined, lastLogin]);

  const handleFriendRequest = async () => {
    try {
      console.log("Sending friend request from:", userId, "to:", profileUserId);
      await axios.post(`${HOST_PATH}/friendships/`, {
        user_id: userId, 
        friend_id: profileUserId, 
      });
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error.response?.data || error);
    }
  };
  

  const handleRemoveFriend = async (friendshipId) => {
    try {
      await axios.patch(`${HOST_PATH}/friendships/${friendshipId}/`, {
        status: "Inactive",
      });
      alert("Friend removed successfully!");
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      await axios.post(`${HOST_PATH}/comments/`, {
        user_id: userId, // The current user's ID
        text: newComment,
      });
      setComments((prevComments) => [...prevComments, { user: username, text: newComment }]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (userNotFound) return <p>User not found in the database.</p>;

  return (
    <main className="main-profile">
      <div className="profile-columns">
        <div className="left-column">
          <h1>User Profile</h1>
          <div className="profile-details">
            <p>
              <strong>Username:</strong> {profileData.username}
            </p>
            <p>
              <strong>Date Joined:</strong> {profileData.dateJoined}
            </p>
            <p>
              <strong>Last Login:</strong> {profileData.lastLogin || profileData.dateJoined}
            </p>
          </div>
          <button onClick={handleFriendRequest}>Request</button>
          <button>
            Friends
            <div className="dropdown">
              <button
                onClick={() => {
                  const friendshipId = "FRIENDSHIP_ID_PLACEHOLDER"; // Replace with actual ID
                  handleRemoveFriend(friendshipId);
                }}
              >
                Remove Friend
              </button>
            </div>
          </button>
          <div className="recent-games">
            <h2>Recent Games</h2>
            {recentGames.length > 0 ? (
              <ul>
                {recentGames.map((game, index) => (
                  <GameEntry
                    key={index}
                    gameLength={game.game_length}
                    users={[
                      { id: game.player_one, name: "" },
                      { id: game.player_two, name: "" },
                    ]}
                    status={game.status}
                    scores={[game.player_one_score, game.player_two_score]}
                  />
                ))}
              </ul>
            ) : (
              <p>No recent games available.</p>
            )}
          </div>
        </div>
        <div className="right-column">
          <div className="comment-wall">
            <h2>Comment Wall</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Post Comment</button>
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.user}:</strong> {comment.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;

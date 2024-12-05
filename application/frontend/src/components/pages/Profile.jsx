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
  const [profilePicture, setProfilePicture] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const { userId } = useUserAuthStore();


  
  const fetchUserMetaData = async (userIdToFetch) => {
    try {
      const response = await axios.get(`${HOST_PATH}/user-metadata/`, {
        params: { user_id: userIdToFetch },
      });
      if (response.data && response.data.length > 0) {
        const metadata = response.data[0];
        console.log("Received metadata:", metadata);
  
        setProfilePicture(metadata.profile_picture || "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Trollface.png/220px-Trollface.png");
        // Update sessionStorage
        const storedData = JSON.parse(sessionStorage.getItem("user-metadata-state")) || {};
        storedData.state = storedData.state || {};
        storedData.state.settings = {
          ...storedData.state.settings,
          profile_picture: metadata.profile_picture,
        };
        sessionStorage.setItem("user-metadata-state", JSON.stringify(storedData));
      } else {
        console.error("No metadata found for user.");
      }
    } catch (error) {
      console.error("Error fetching user metadata:", error);
    }
  };
  
  useEffect(() => {
    fetchUserMetaData(profileUserId);
  }, [profileUserId]);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch recent games
        const gamesResponse = await axios.get(
          `${HOST_PATH}/games?recent_games=true&user_id=${profileUserId}`
        );
        const commentsResponse = await axios.get(
          `${HOST_PATH}/comments?user_id=${profileUserId}`
        );
        const userMetaDataResponse = await axios.get(
          `${HOST_PATH}/user-metadata?user_id=${profileUserId}`
        );
      
        setIsOnline(userMetaDataResponse.data[0].is_online);
        setProfileData({
          username: username,
          dateJoined: dateJoined,
          lastLogin: lastLogin,
        });
    
        // Update recent games
        setRecentGames(
          gamesResponse.data.filter((game) => game.status === "Complete") || []
        );
    
        // Map comments to include commenter username
        const enrichedComments = commentsResponse.data.map((comment) => ({
          username: comment.username, // Use the `username` field directly from the API
          comment: comment.comment,
          date: comment.date,
        }));
    
        setComments(enrichedComments);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setUserNotFound(true);
        setLoading(false);
      }
    };
    
  
    fetchProfileData();

  }, [profileUserId, username, dateJoined, lastLogin]);


  const handleFriendRequest = async () => {
    try {
      console.log("Sending friend request from:", userId, "to:", profileUserId);

      const response = await axios.post(`${HOST_PATH}/friendships/`, {

        user_id: userId,
        friend_id: profileUserId,
      });
      alert(response.data.success || "Friend request sent!");
    } catch (error) {

      const errorMessage = error.response?.data?.error || "An error occurred.";
      if (errorMessage === "Friendship already exists.") {
        alert("This friendship is already active.");
      } else if (errorMessage === "Friendship is already pending approval.") {
        alert("This friendship request is already pending.");
      } else {
        console.error("Error sending friend request:", errorMessage);
      }
    }
  };
  
  const handleRemoveFriend = async () => {
    try {
      // Fetch the friendship ID dynamically
      const response = await axios.get(`${HOST_PATH}/friendship/`, {
        params: { user_id: userId, friend_id: profileUserId, status: "Accepted" },
      });
  
      if (response.data.length === 0) {
        alert("No active friendship found!");
        return;
      }
  
      const friendshipId = response.data[0].id;
  
      // Remove the friendship
      await axios.patch(`${HOST_PATH}/friendship/${friendshipId}/`, {
        status: "Inactive",
      });
  
      alert("Friend removed successfully!");
    } catch (error) {
      console.error("Error removing friend:", error.response?.data || error);
    }
  };
  
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(`${HOST_PATH}/comments/`, {
        user_id: userId, // ID of the user adding the comment
        text: newComment,
        comment_type: "User", // Specify comment is for a user
        content_id: profileUserId, // ID of the profile the comment is for
      });

        // Fetch the logged-in user's username (if not already available in state)
        const commenterUsername = response.data.username || "Anonymous"; // Use response username or fallback

        // Update local comments state with the new comment
        setComments((prevComments) => [
          {
            username: commenterUsername, // Use the logged-in user's username
            comment: newComment,
            date: response.data.date,
          },
          ...prevComments,
        ]);
      
      setNewComment(""); // Clear input field

    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleUpdateProfilePicture = async () => {
    try {
      await axios.post(`${HOST_PATH}/update-user-metadata/`, {
        user_id: userId,
        profile_picture: profilePicture,
      });
      alert("Profile picture updated!");
  
      // Update sessionStorage
      const storedData = JSON.parse(sessionStorage.getItem("user-metadata-state")) || {};
      storedData.state = storedData.state || {};
      storedData.state.settings = {
        ...storedData.state.settings,
        profile_picture: profilePicture,
      };
      sessionStorage.setItem("user-metadata-state", JSON.stringify(storedData));
  
      // Optionally, re-fetch metadata
      fetchUserMetaData();
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };
  
  useEffect(() => {
    const fetchGame = async (gameId) => {
      try {
        const gameResponse = await axios.get(
          `${HOST_PATH}/games/?game_id=${gameId}`
        );
        const data = gameResponse.data[0];

        if (data.status === "Complete") {
          setRecentGames([data, ...recentGames]);
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
      if (message.type === "connected") console.log(message);

      if (message.type === "game") {
        console.log("Received game message:", message);
        fetchGame(message.game_id);
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


  if (loading) return <p>Loading profile...</p>;
  if (userNotFound) return <p>User not found in the database.</p>;

  return (
    <main className="main-profile">
      <div className="profile-columns">
        <div className="left-column">
          <h1>User Profile</h1>
          <img
          src={profilePicture || "default-profile-pic.png"}
          alt="Profile"
          style={{ width: 200, height: 150, borderRadius: "50%" }}
        />
        {userId === profileUserId && (
        <>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="Enter profile picture URL"
          />
          <button onClick={handleUpdateProfilePicture}>
            Update Profile Picture
          </button>
        </>
      )}

          <div className="profile-details">
            <p>
              <strong>Username:</strong> {profileData.username}
              <span>{isOnline ? "🟢" : "🔴"}</span>
            </p>
            <p>
              <strong>Date Joined:</strong> {profileData.dateJoined}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {profileData.lastLogin || profileData.dateJoined}
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
                    gameId={game.id}
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
          <button onClick={handleFriendRequest}>Request</button>
        </div>
        <div className="right-column">
          <div className="comment-wall">
            <h2>Comment Wall</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button onClick={handleAddComment}>Post Comment</button>
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>
                  <strong>{comment.username}:</strong> {comment.comment} <em>({comment.date})</em>
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

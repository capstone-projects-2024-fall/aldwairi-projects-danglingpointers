// Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import GameEntry from "../entries/GameEntry";

const Profile = ({ userId, username, dateJoined, lastLogin }) => {
  const [profileData, setProfileData] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const [gameMessage, setGameMessage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const gamesResponse = await axios.get(
          `${HOST_PATH}/games?recent_games=true&user_id=${userId}`
        );

        setProfileData({
          username: username,
          dateJoined: dateJoined,
          lastLogin: lastLogin,
        });

        setRecentGames(
          gamesResponse.data.filter((game) => game.status === "Complete") || []
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setUserNotFound(true);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, username, dateJoined, lastLogin]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/game-server/`);

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game") {
        setGameMessage(message);
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

  if (loading) return <p className="mr-def">Loading profile...</p>;
  if (userNotFound)
    return <p className="mr-def">User not found in the database.</p>;

  // Mock data for the comment wall
  const comments = [
    { id: 1, user: "MockUser1", text: "Great profile!" },
    { id: 2, user: "MockUser2", text: "Looking forward to playing again!" },
    { id: 3, user: "MockUser3", text: "Nice scores on your last games!" },
  ];

  return (
    <main className="main-profile">
      <div className="profile-info">
        <h1>User Profile</h1>
        <div className="profile-header">
          <div className="profile-pic-container">
            <img
              src="https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png" //placeholder to fix later
              alt="Profile"
              className="profile-pic"
            />
          </div>
          <div className="profile-details">
            <div>
              <strong>Username:</strong> {profileData.username}
              <span className="online-status" />
            </div>
            <div>
              <strong>Date Joined:</strong> {profileData.dateJoined}
            </div>
            <div>
              <strong>Last Login:</strong>{" "}
              {profileData.lastLogin || profileData.dateJoined}
            </div>
          </div>
        </div>
        <div className="recent-games">
          <h2>Recent Games</h2>
          {recentGames.length > 0 ? (
            <ul>
              {recentGames.map((game, index) => (
                <GameEntry
                  key={index}
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
        <div className="comment-wall">
          <h2>Comment Wall</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.user}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        </div>
        {/* Display game message if available */}
        {gameMessage && (
          <div className="game-message">
            <h2>Live Game Update</h2>
            <p>Game ID: {gameMessage.game_id}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;

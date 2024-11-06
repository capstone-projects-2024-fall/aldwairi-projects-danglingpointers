// Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";

const Profile = ({ userId, username, dateJoined, lastLogin }) => {
  const [profileData, setProfileData] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

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
          Array.isArray(gamesResponse.data) ? gamesResponse.data : []
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

  if (loading) return <p className="mr-def">Loading profile...</p>;
  if (userNotFound)
    return <p className="mr-def">User not found in the database.</p>;

  return (
    <main className="main-profile">
      <h1>User Profile</h1>
      <div className="profile-info">
        <div>
          <strong>Username:</strong> {profileData.username}
        </div>
        <div>
          <strong>Date Joined:</strong> {profileData.dateJoined}
        </div>
        <div>
          <strong>Last Login:</strong>{" "}
          {profileData.lastLogin || profileData.dateJoined}
        </div>
        <div className="recent-games">
          <h2>Recent Games</h2>
          {recentGames.length > 0 ? (
            <ul>
              {recentGames.map((game, index) => (
                <li key={index}>
                  Mode: {game.mode}, Score: {game.player_one_score} vs{" "}
                  {game.player_two_score || "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent games available.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;

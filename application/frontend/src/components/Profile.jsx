// Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get(`/api/users/?profile=true&user_id=${userId}`);
        const statsResponse = await axios.get(`/api/user_metadata/?profile_stats=true&user_id=${userId}`);
        const gamesResponse = await axios.get(`/api/games/?recent_games=true&user_id=${userId}`);

        if (!profileResponse.data.length) {
          setUserNotFound(true);
          setLoading(false);
          return;
        }

        setProfileData({
          username: profileResponse.data[0]?.username,
          dateJoined: profileResponse.data[0]?.date_joined,
          stats: statsResponse.data[0],
        });
        setRecentGames(Array.isArray(gamesResponse.data) ? gamesResponse.data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setUserNotFound(true);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (userNotFound) return <p>User not found in the database.</p>;

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-info">
        <div><strong>Username:</strong> {profileData.username || "N/A"}</div>
        <div><strong>Date Joined:</strong> {profileData.dateJoined || "N/A"}</div>
        <div><strong>Solo Games Played:</strong> {profileData.stats?.solo_games_played}</div>
        <div className="recent-games">
          <h2>Recent Games</h2>
          {recentGames.length > 0 ? (
            <ul>
              {recentGames.map((game, index) => (
                <li key={index}>
                  Mode: {game.mode}, Score: {game.player_one_score} vs {game.player_two_score || "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent games available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
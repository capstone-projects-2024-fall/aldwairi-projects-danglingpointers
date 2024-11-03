// Profile.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';

const Profile = ({ userId }) => {
    const [profileData, setProfileData] = useState(null);
    const [recentGames, setRecentGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userNotFound, setUserNotFound] = useState(false);
    const HOST_PATH = 'http://localhost:8000/api';

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileResponse = await axios.get(`${HOST_PATH}/users?user_id=${userId}`);
                const gamesResponse = await axios.get(`${HOST_PATH}/games?recent_games=true&user_id=${userId}`);
                const response = await axios.get(`${HOST_PATH}/games/`);
                console.log(response);

                if (!profileResponse.data.length) {
                    setUserNotFound(true);
                    setLoading(false);
                    return;
                }

                setProfileData({
                    username: profileResponse.data[0]?.username,
                    dateJoined: profileResponse.data[0]?.date_joined,
                });
                setRecentGames(Array.isArray(gamesResponse.data) ? gamesResponse.data : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setUserNotFound(true);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
            .getDate()
            .toString()
            .padStart(2, '0')}`;
    };

    const soloGames = recentGames.filter((game) => game.mode === 'Solo');
    const versusGames = recentGames.filter((game) => game.mode === 'Versus');

    if (loading) return <p className="mr-def">Loading profile...</p>;
    if (userNotFound) return <p className="mr-def">User not found in the database.</p>;

    return (
        <main className="main-profile">
            <h1>User Profile</h1>
            <div className="profile-info">
                <div>
                    <strong>Username:</strong> {profileData.username || 'N/A'}
                </div>
                <div>
                    <strong>Date Joined:</strong> {profileData.dateJoined || 'N/A'}
                </div>

                <div className="recent-games">
                    <h2>Recent Games</h2>

                    <article className="solo-games">
                        <h3>Solo Games</h3>
                        {soloGames.length > 0 ? (
                            <ul>
                                {soloGames.map((game, index) => (
                                    <li key={index}>
                                        Mode: {game.mode}, Score: {game.player_one_score}, Date: {formatDate(game.date)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recent solo games available.</p>
                        )}
                    </article>

                    <article className="versus-games">
                        <h3>Versus Games</h3>
                        {versusGames.length > 0 ? (
                            <ul>
                                {versusGames.map((game, index) => (
                                    <li key={index}>
                                        Mode: {game.mode}, Score: {game.player_one_score} vs{' '}
                                        {game.player_two_score || 'N/A'}, Date: {formatDate(game.date)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recent versus games available.</p>
                        )}
                    </article>
                </div>
            </div>
        </main>
    );
};

export default Profile;

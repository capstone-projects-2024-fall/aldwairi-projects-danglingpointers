import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Leaderboards() {
    const [leaderboardsSolo, setLeaderboardsSolo] = useState([]);
    const [leaderboardsVersus, setLeaderboardsVersus] = useState([]);
    const [leaderboardsHighScore, setLeaderboardsHighScore] = useState([]);
    const [leaderboardsHighTime, setLeaderboardsHighTime] = useState([]);
    const HOST_PATH = 'http://localhost:8000/api';

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const soloResponse = await axios.get(`${HOST_PATH}/games?leaderboards_solo=true`);
                const versusResponse = await axios.get(`${HOST_PATH}/games?leaderboards_versus=true`);
                const highScoreResponse = await axios.get(`${HOST_PATH}/games?leaderboards_highscore=true`);
                const highTimeResponse = await axios.get(`${HOST_PATH}/games?leaderboards_hightime=true`);

                setLeaderboardsSolo(soloResponse.data || []);
                setLeaderboardsVersus(versusResponse.data || []);

                const highScores = [];
                (highScoreResponse.data || []).forEach((game) => {
                    if (game.player_one_score) highScores.push({ ...game, score: game.player_one_score });
                    if (game.player_two_score) highScores.push({ ...game, score: game.player_two_score });
                });
                highScores.sort((a, b) => b.score - a.score);
                setLeaderboardsHighScore(highScores);

                const sortedHighTime = (highTimeResponse.data || []).sort((a, b) => b.game_length - a.game_length);
                setLeaderboardsHighTime(sortedHighTime);
            } catch (error) {
                console.error('Error fetching games data:', error);
            }
        };

        fetchGames();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
            .getDate()
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <main className="main-default main-leaderboards">
            <h2>Leaderboards</h2>
            <section className="leaderboards-section">
                <h3>Solo Leaderboard</h3>
                {leaderboardsSolo.length > 0 ? (
                    <ul>
                        {leaderboardsSolo.map((game, index) => (
                            <li key={index}>
                                Score: {game.player_one_score}, Date: {formatDate(game.date)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No solo leaderboard available.</p>
                )}
            </section>

            <section className="leaderboards-section">
                <h3>Versus Leaderboard</h3>
                {leaderboardsVersus.length > 0 ? (
                    <ul>
                        {leaderboardsVersus.map((game, index) => (
                            <li key={index}>
                                Mode: {game.mode}, Game: {game.id}, Length: {game.game_length}, Score:{' '}
                                {game.player_one_score} vs {game.player_two_score || 'N/A'}, Date:{' '}
                                {formatDate(game.date)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No versus leaderboard available.</p>
                )}
            </section>

            <section className="leaderboards-section">
                <h3>High Score Leaderboard</h3>
                {leaderboardsHighScore.length > 0 ? (
                    <ul>
                        {leaderboardsHighScore.map((game, index) => (
                            <li key={index}>
                                Mode: {game.mode}, Game: {game.id}, High Score: {game.score}, Date:{' '}
                                {formatDate(game.date)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No high score leaderboard available.</p>
                )}
            </section>

            <section className="leaderboards-section">
                <h3>High Time Leaderboard</h3>
                {leaderboardsHighTime.length > 0 ? (
                    <ul>
                        {leaderboardsHighTime.map((game, index) => (
                            <li key={index}>
                                Game: {game.id}, High Time: {game.game_length}, Date: {formatDate(game.date)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No high time leaderboard available.</p>
                )}
            </section>
        </main>
    );
}

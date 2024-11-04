import { Link } from 'react-router-dom';

export default function LeaderboardEntry({ user, score, timePlayed, date, gameLink }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
            .getDate()
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div className="leaderboard-entry">
            <p className="leaderboard-user">User: {user}</p>
            <p className="leaderboard-score">Score: {score}</p>
            <p className="leaderboard-time">Time Played: {timePlayed}</p>
            <p className="leaderboard-date">Date: {formatDate(date)}</p>
            <Link to={gameLink} className="leaderboard-link">
                View Game
            </Link>
        </div>
    );
}

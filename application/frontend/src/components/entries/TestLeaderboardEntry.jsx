import LeaderboardEntry from './LeaderboardEntry';

export default function TestLeaderboardEntry() {
    const sampleData = {
        user: 'Player 1',
        score: 500,
        timePlayed: '2 hours',
        date: '2024-11-01',
        gameLink: '/games/1',
    };

    return (
        <LeaderboardEntry
            user={sampleData.user}
            score={sampleData.score}
            timePlayed={sampleData.timePlayed}
            date={sampleData.date}
            gameLink={sampleData.gameLink}
        />
    );
}

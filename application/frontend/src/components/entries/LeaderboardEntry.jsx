import React from 'react';
import styles from '../styles/LeaderboardEntry.scss';

const LeaderboardEntry = ({ user, score, timePlayed, date, gameLink }) => {
    return (
        <div className={styles['leaderboard-entry']}>
            <div className={styles['user-info']}>
                <h3>{user}</h3>
            </div>
            <div className={styles['score-info']}>
                <p>
                    <strong>Score:</strong> {score}
                </p>
                <p>
                    <strong>Time Played:</strong> {timePlayed}
                </p>
                <p>
                    <strong>Date:</strong> {date}
                </p>
            </div>
            <div className={styles['game-link']}>
                <a href={gameLink} target="_blank" rel="noopener noreferrer">
                    Play Game
                </a>
            </div>
        </div>
    );
};

import React from 'react';
import GameEntry from './GameEntry';
import '.../styles/watch-entry.scss';

export default function WatchPreview({users, status, gameLink, "..."}){
    return(
        <div className = "watch-preview">
            <GameEntry users = {users} status={status} gameLink={gameLink}/>
            <div className = "watch-feature">
                //feature exclusive to watch listings
            </div>
        </div>

    );
}
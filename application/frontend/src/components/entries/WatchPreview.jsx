import GameEntry from './GameEntry';

export default function WatchPreview({users, status, gameLink,videoDescription}){
    return(
        <div className = "watch-preview">
            <GameEntry users = {users} status={status} gameLink={gameLink}/>
            <div className = "description-container">
                <p className="video-description">{videoDescription}</p>
            </div>
        </div>

    );
}
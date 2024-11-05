import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameEntry({ users, status, gameLink, mode=null, scores=[] }) {
  const [btnColor, setBtnColor] = useState('blue');
  const navigate = useNavigate();

  useEffect(() => {
    status === 'Complete' ? setBtnColor('green') : setBtnColor('blue');
  }, [status]);

  return (
    <section className="base-entry game-entry">
      <div className="game-users">
        {users.map((user, index) => <p key={user.id}>User {index + 1}: {user.id ?? "N/A" /*user.name*/}</p>)}
      </div>
      {mode &&
      <div>
        Mode: {mode}
      </div>}
      <div>
        {scores.map((score, index) => <p key={index}>User {index + 1} Score: {score ?? "N/A"}</p>)}
      </div>
      <div className="game-status">
        Status: 
        <button className={`btn-status ${btnColor}`}>{status}</button>
      </div>
      <div className="game-link">
        <a href={gameLink} onClick={(e) => { e.preventDefault(); navigate(gameLink); }}>More…</a>
      </div>
    </section>
  );
}
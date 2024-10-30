import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/game-entry.scss'; 

export default function GameEntry({ users, status, gameLink }) {
  const [btnColor, setBtnColor] = useState('blue');
  const navigate = useNavigate();

  useEffect(() => {
    status === 'Complete' ? setBtnColor('green') : setBtnColor('blue');
  }, [status]);

  return (
    <section className="base-entry game-entry">
      <div className="game-users">
        {users.map(user => <p key={user.id}>{user.name}</p>)}
      </div>
      <div className="game-status">
        <p>{status}</p>
        <button className={`btn-status ${btnColor}`}>{status}</button>
      </div>
      <div className="game-link">
        <a href={gameLink} onClick={(e) => { e.preventDefault(); navigate(gameLink); }}>More…</a>
      </div>
    </section>
  );
  //unfinished
}
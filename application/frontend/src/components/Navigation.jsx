import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button'; // Custom Button component
import Search from './Search'; // Import Search component
import Login from './Login'; // Import Login component

export default function Navigation() {
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">
            <Button text="Home" />
          </Link>
        </li>
        <li>
          <Link to="/game">
            <Button text="Game" />
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <Button text="Dashboard" />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <Button text="Profile" /> {/* Direct link to Profile page */}
          </Link>
        </li>
      </ul>

      {/* Button to toggle Search visibility */}
      <Button text="Search" onClick={() => setShowSearch(!showSearch)} />
      {showSearch && <Search />}

      {/* Button to toggle Login visibility */}
      <Button text="Login" onClick={() => setShowLogin(!showLogin)} />
      {showLogin && <Login />}
    </nav>
  );
}

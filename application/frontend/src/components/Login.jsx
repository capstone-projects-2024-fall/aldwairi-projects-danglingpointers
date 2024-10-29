// components/Login.js
import React, { useState } from 'react';
import Button from './Button'; // Import your Button component

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate a response object
    const response = { username, authenticated: true };

    // Save response to session storage
    sessionStorage.setItem('user', JSON.stringify(response));

    // Reset form fields (optional)
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button text="Login" onClick={handleSubmit} /> {/* Use Button component */}
      </form>
    </div>
  );
}

export default Login;

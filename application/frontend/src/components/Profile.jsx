import React from 'react';


const Profile = () => {
  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-info">
        <div className="username">
          <strong>Username:</strong> Placeholder
        </div>
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="recent-games">
          <strong>Recent Games:</strong>
          <ul>
            <li>Game 1</li>
            <li>Game 2</li>
            <li>Game 3</li>
            {/* Add more placeholders as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

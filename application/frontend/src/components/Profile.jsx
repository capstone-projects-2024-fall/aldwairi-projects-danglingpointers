import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const handleSave = () => {
    // For now, just log the profile info
    console.log('Profile updated:', { description, profilePicture });

    //Replace with actual logic to store data in database

    // Navigate back to the dashboard
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add a description..."
        />
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" onChange={handleProfilePictureChange} />
      </div>    
      <div>
        {profilePicture && (
          <img
            src={profilePicture}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        )}
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default Profile;

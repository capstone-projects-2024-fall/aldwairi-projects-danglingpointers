import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <button onClick={goToProfile}>Edit Profile</button>
    </div>
  );
}

export default Dashboard;

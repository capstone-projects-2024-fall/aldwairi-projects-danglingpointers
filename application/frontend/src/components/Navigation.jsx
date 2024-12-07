import { Link } from "react-router-dom";
import Button from "./Button"; // Custom Button component
import Search from "./Search"; // Import Search component
import Login from "./Login"; // Import Login component
import useUserAuthStore from "../stores/userAuthStore";
import useUserMetaDataStore from "../stores/userMetaDataStore";

export default function Navigation() {
  const { isLoggedIn, userId, logout } = useUserAuthStore();
  const { logoutUserMetaData } = useUserMetaDataStore();

  const handleLogout = async () => {
    try {
      const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
      console.log("User Metadata State:", store);

      const formData = {
        user_id: userId,
        settings: store.state.settings,
        user_points: store.state.points,
        items: store.state.items,
        logout: true,
      };
      await logoutUserMetaData(formData);
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navigation">
      <Link to="/" text="Dangling Pointers" id="home-nav-button">
        <h1>Dangling Pointers</h1>
      </Link>
      <ul className="ul-default">
        <li className="li-home"></li>
        <li>
          <Link to="/leaderboards">
            <Button id="leaderboard-nav-button" text="Leaderboards" />
          </Link>
        </li>
        <li>
          <Link to="/play">
            <Button id="play-nav-button" text="Play" />
          </Link>
        </li>
        <li>
          <Link to="/watch">
            <Button id="watch-nav-button" text="Watch" />
          </Link>
        </li>
        <li className="li-row">
          <Search />
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/dashboard">
                <Button id="dashboard-nav-button" text="Dashboard" />
              </Link>
            </li>
            <li>
              <Button id="logout-nav-button" text="Logout" onClick={handleLogout} />
            </li>
          </>
        ) : (
          <li className="li-row">
            <Login />
          </li>
        )}
      </ul>
    </nav>
  );
}

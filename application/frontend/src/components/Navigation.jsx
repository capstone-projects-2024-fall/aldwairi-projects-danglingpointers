import { Link } from "react-router-dom";
import Button from "./Button"; // Custom Button component
import Search from "./Search"; // Import Search component
import Login from "./Login"; // Import Login component
import useUserAuthStore from "../stores/userAuthStore";

export default function Navigation() {
  const { isLoggedIn, logout } = useUserAuthStore();

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
          <Link to="/profile">
            <Button text="Profile" />
          </Link>
        </li>
        <li className="li-row">
          <Search />
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/dashboard">
                <Button text="Dashboard" />
              </Link>
            </li>
            <li>
              <Button text="Logout" onClick={logout} />
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

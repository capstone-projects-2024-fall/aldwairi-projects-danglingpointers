import { Link } from 'react-router-dom';
import Button from './Button'; //update in future

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">
            <Button>Home</Button> {/* Using the custom Button */}
          </Link>
        </li>
        <li>
          <Link to="/game">
            <Button>Game</Button> {/* Using the custom Button */}
          </Link>
        </li>
        {/* Add more links as needed (login, signup, etc.)*/}
      </ul>
    </nav>
  );
}

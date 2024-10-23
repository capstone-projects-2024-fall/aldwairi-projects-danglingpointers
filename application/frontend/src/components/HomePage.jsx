import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homepage">
      <h1>Welcome to the App</h1>
      <p>Please choose an option:</p>
      <div>
        <Link to="/dashboard">
          <button>Enter Dashboard without Account</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

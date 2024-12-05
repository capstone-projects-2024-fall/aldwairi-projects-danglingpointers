import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) return;

    const formData = {
      username: username,
      password: password,
    };

    try {
      await login(formData);      
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

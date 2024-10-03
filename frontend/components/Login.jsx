import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async e => {
    e.preventDefault();
    await axios
      .post("/login", {
        username: username,
        password: password,
      })
      .then(() => {
        setError("");
        navigate("/");
      })
      .catch(() => setError("* invalid credentials"));
  };

  return (
    <main className="main">
      <div style={{ paddingTop: "10rem", paddingBottom: "1rem" }}>Login</div>
      <form onSubmit={handleLogin}>
        <div>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        </div>
        <div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        </div>
        <div className="error">{error}</div>
        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
    </main>
  );
};

export default Login;

/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ notify }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async e => {
    e.preventDefault();
    await axios
      .post("/login", {
        username: username,
        password: password,
      })
      .then(() => {
        navigate("/");
      })
      .catch(() => notify("Invalid credentials.", false));
  };

  return (
    <main className="main center">
      <div style={{ paddingTop: "10rem", paddingBottom: "1rem" }}>Login</div>
      <form onSubmit={handleLogin}>
        <div>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        </div>
        <div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        </div>
        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
    </main>
  );
};

export default Login;

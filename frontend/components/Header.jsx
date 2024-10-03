/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = ({ notify }) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isUser, setIsUser] = useState(true);
  const navigate = useNavigate();
  const verify = () => {
    axios
      .get("/verify")
      .then(() => {
        axios
          .post("/checkgroup", { group: "admin" })
          .then(() => setIsAdmin(true))
          .catch(() => setIsAdmin(false))
          .finally(() => setIsUser(true));
      })
      .catch(() => {
        setIsUser(false);
        setIsAdmin(false);
        navigate("/login");
      });
  };

  const logout = e => {
    e.preventDefault();
    notify("logged out");
    axios.get("/logout").then().finally(verify);
  };

  // on change
  useEffect(verify, [navigate, setIsAdmin, setIsUser, isAdmin, isUser]);
  return (
    <header>
      {isUser ? (
        <nav className="navbar">
          <div className="headerlink">
            <Link to="/">Task Management</Link> | {isAdmin ? <Link to="/UMS">User Management</Link> : <span> </span>}
          </div>
          <div className="headerlink">
            <Link to="/profile">Profile</Link> | <Link onClick={logout}>Log Out</Link>
          </div>
        </nav>
      ) : (
        <></>
      )}
    </header>
  );
};

export default Header;

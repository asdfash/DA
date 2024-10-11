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
    axios.get("/logout").then(notify("logged out", true)).finally(verify);
  };

  // on change
  useEffect(verify, [navigate, setIsAdmin, setIsUser, isAdmin, isUser]);

  return (
    <>
      {isUser ? (
        <header className="header split">
          <div>
            <a href="/">Task Management</a> | {isAdmin ? <a href="/UMS">User Management</a> : <span> </span>}
          </div>
          <div>
            <a href="/profile">Profile</a> | <Link onClick={logout}>Log Out</Link>
          </div>
        </header>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;

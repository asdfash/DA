/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ notify }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateBool, updateInfo] = useState(false);
  const navigate = useNavigate();

  //on mount
  useEffect(() => {
    axios.get("/viewProfile").then(res => {
      setUsername(res.data.username);
      setEmail(res.data.email);
    });
  }, [updateBool]);

  const handleEmailChange = e => {
    e.preventDefault();
    // Logic for changing email
    axios
      .patch("/editEmail", {
        email: newEmail,
      })
      .then(() => {
        if (newEmail != email) {
          notify("email changed", true);
        }
        setNewEmail("");
        updateInfo(!updateBool);
      })
      .catch(err => {
        err.response.status === 401 ? navigate("/login") : notify("invalid email", false);
      });
  };

  const handlePasswordChange = e => {
    e.preventDefault();
    // Logic for changing password
    axios
      .patch("/editPassword", {
        password: newPassword,
      })
      .then(() => {
        notify("password changed", true);
        setNewPassword("");
        updateInfo(!updateBool);
      })
      .catch(err => {
        err.response.status === 401 ? navigate("/login") : notify("invalid password", false);
      });
  };
  return (
    <main className="main center">
      <div>
        <p>
          Username: <strong>{username}</strong>
        </p>
        <p>
          Email: <strong>{email}</strong>
        </p>
      </div>
      <form onSubmit={handleEmailChange}>
        <div>
          <input type="text" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Enter new email" />
          <button type="submit">Change Email</button>
        </div>
      </form>
      <form onSubmit={handlePasswordChange}>
        <div>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
          <button type="submit">Change Password</button>
        </div>
      </form>
    </main>
  );
};

export default Profile;

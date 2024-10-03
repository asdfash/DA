//modules
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

// CSS
import "./index.css";

// Components
import Header from "./components/Header";
import Profile from "./components/Profile";
import TMS from "./components/TMS";
import UMS from "./components/UMS";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Notification from "./components/Notification";

//axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
  const [notificationMsg, setNotificationMsg] = useState("");
  const notify = msg => {
    setNotificationMsg("");
    setNotificationMsg(msg);
  };

  const handleCloseNotification = () => {
    setNotificationMsg("");
  };

  return (
    <BrowserRouter>
      {notificationMsg ? (
        <Notification
          message={notificationMsg}
          duration={1500} // Notification will close after 3 seconds
          onClose={handleCloseNotification}
        />
      ) : (
        <></>
      )}
      <Header notify={notify} />
      <Routes>
        <Route path="/" element={<TMS />} />
        <Route path="/profile" element={<Profile notify={notify} />} />
        <Route path="/UMS" element={<UMS notify={notify} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/TMS" element={<TMS />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

//creates react root in 'root' id in index.html
createRoot(document.getElementById("root")).render(<App />);

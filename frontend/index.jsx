/* eslint-disable react-refresh/only-export-components */
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
import Applist from "./components/Applist";
import UMS from "./components/UMS";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Notification from "./components/Notification";
import Tasklist from "./components/Tasklist";

//axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

const App = () => {
  const [notification, setNotification] = useState({ msg: "", duration: 1500, success: true });
  const [selectedApp, setSelectedApp] = useState({});
  const notify = (msg, success) => {
    setNotification({ ...notification, msg: "" });
    setNotification({ ...notification, msg: msg, success: success });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, msg: "" });
  };

  return (
    <BrowserRouter>
      {notification.msg ? <Notification message={notification.msg} duration={1500} success={notification.success} onClose={handleCloseNotification} /> : <></>}
      <Header notify={notify} />
      <Routes>
        <Route path="/" element={<Applist notify={notify} setSelectedApp={setSelectedApp} />} />
        <Route path="/tms" element={<Applist notify={notify} setSelectedApp={setSelectedApp} />} />
        <Route path="/profile" element={<Profile notify={notify} />} />
        <Route path="/app" element={<Tasklist notify={notify} selectedApp={selectedApp} />} />
        <Route path="/UMS" element={<UMS notify={notify} />} />
        <Route path="/login" element={<Login notify={notify} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

//creates react root in 'root' id in index.html
createRoot(document.getElementById("root")).render(<App />);

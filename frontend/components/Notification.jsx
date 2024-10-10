/* eslint-disable react/prop-types */
import { useEffect } from "react";

const Notification = ({ message, duration, success, onClose }) => {
  // Automatically hide notification after "duration" time
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className={success ? "notification success" : "notification failure"}>{message}</div>;
};

export default Notification;

/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import popups
import Planlist from "./Modal/Planlist";
import App from "./Modal/App";
import Task from "./Modal/Task";
import CreateTask from "./Modal/CreateTask";

const Tasklist = ({ notify, selectedApp }) => {
  const headers = ["open", "todo", "doing", "done", "closed"];
  const [popup, setPopup] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [selectedtaskid, setSelectedtaskid] = useState("");
  const navigate = useNavigate();

  //on mount
  useEffect(() => {
    if (!selectedApp.acronym) {
      navigate("/");
    }
    axios
      .post("/checkpermission", { permission: "create", app_acronym: selectedApp.acronym })
      .then(() => setIsCreate(true))
      .catch(() => setIsCreate(false));
  }, [navigate, selectedApp]);
  return (
    <main className="main">
      <Planlist notify={notify} selectedApp={selectedApp} popup={popup} setPopup={setPopup} />
      <App selectedApp={selectedApp} popup={popup} setPopup={setPopup} />
      <Task notify={notify} taskid={selectedtaskid} popup={popup} setPopup={setPopup} />
      <CreateTask notify={notify} app={selectedApp.acronym} popup={popup} setPopup={setPopup} />
      <div className="split">
        <div>
          <strong>{selectedApp.acronym}</strong> | <button onClick={() => setPopup("app")}> details</button>
        </div>
        <div>
          <button onClick={() => setPopup("planlist")}>Plans</button> {isCreate ? <button onClick={() => setPopup("createtask")}>Create Task</button> : ""}
        </div>
      </div>

      <table className="task">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* ensure that lines show */}
          <tr>
            {headers.map(header => (
              <td key={header}>
                {header==='open'?<div
                  className="card"
                  style={{ borderLeft: "10px solid".concat("#d00") }}
                  id={"a"}
                  onClick={e => {
                    setSelectedtaskid(e.target.id);
                    setPopup("task");
                  }}
                >
                  <strong>Task id</strong>
                  <p>task Name</p>
                  <p>task owner</p>
                </div>:''}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </main>
  );
};

export default Tasklist;

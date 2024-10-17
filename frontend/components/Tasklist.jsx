/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import popups
import Planlist from "./Modal/Planlist";
import App from "./Modal/App";
import Task from "./Modal/Task";
import CreateTask from "./Modal/CreateTask";

const Tasklist = ({ notify, app_acronym }) => {
  const headers = ["open", "todo", "doing", "done", "closed"];
  const [popup, setPopup] = useState("");
  const [tasks, setTasks] = useState({
    open: [],
    todo: [],
    doing: [],
    done: [],
    closed: [],
  });
  const [isCreate, setIsCreate] = useState(false);
  const [selectedtaskid, setSelectedtaskid] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!app_acronym) {
      navigate("/");
    }
    if (popup === "") {
      axios
        .post("/checkpermission", { app_acronym: app_acronym })
        .then(() => setIsCreate(true))
        .catch(() => setIsCreate(false));
      axios
        .post("/viewtasks", { app_acronym: app_acronym })
        .then(res => setTasks(res.data))
        .catch(err => {
          switch (err.response.status) {
            case 401:
              navigate("/login");
              break;
            case 403:
              navigate("/");
              break;
            default:
              notify(err.response.data, false);
          }
        });
    }
  }, [navigate, notify, popup, app_acronym]);

  return (
    <main className="main">
      <Planlist notify={notify} app_acronym={app_acronym} popup={popup} setPopup={setPopup} />
      <App notify={notify} app_acronym={app_acronym} popup={popup} setPopup={setPopup} />
      <Task notify={notify} taskid={selectedtaskid} popup={popup} setPopup={setPopup} />
      <CreateTask notify={notify} app_acronym={app_acronym} popup={popup} setPopup={setPopup} />
      <div className="split">
        <div>
          <strong>{app_acronym}</strong> | <button onClick={() => setPopup("app")}> details</button>
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
          <tr>
            {headers.map(header => (
              <td key={header}>
                {tasks[header].map(task => (
                  <div
                    className="card"
                    style={{ borderLeft: "10px solid".concat(task.colour || "#f8f8f8") }}
                    key={task.id}
                    onClick={e => {
                      e.preventDefault();
                      setSelectedtaskid(task.id);
                      setPopup("task");
                    }}
                  >
                    <strong>{task.id}</strong>
                    <p>{task.name}</p>
                    <p>owner: {task.owner}</p>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </main>
  );
};

export default Tasklist;

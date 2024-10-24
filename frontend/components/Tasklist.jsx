/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import popups
import Planlist from "./Modal/Planlist";
import Task from "./Modal/Task";
import CreateTask from "./Modal/CreateTask";

const Tasklist = ({ notify, appAcronym }) => {
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
    console.log(appAcronym)
    if (!appAcronym) {
      navigate("/");
    } else if (popup === "") {
      axios
        .post("/checkcreatetaskpermission", { app_acronym: appAcronym })
        .then(() => setIsCreate(true))
        .catch(() => setIsCreate(false));
      axios
        .post("/viewtasks", { app_acronym: appAcronym })
        .then(res => setTasks(res.data))
        .catch(err => {
          switch (err.response.status) {
            case 401:
              navigate("/login");
              break;
            case 403:
              navigate("/");
              break;
          }
        });
    }
  }, [appAcronym, navigate, popup]);

  return (
    <main className="main">
      <Planlist notify={notify} app_acronym={appAcronym} popup={popup} setPopup={setPopup} />
      <Task notify={notify} taskid={selectedtaskid} popup={popup} setPopup={setPopup} />
      <CreateTask notify={notify} app_acronym={appAcronym} popup={popup} setPopup={setPopup} />
      <div className="split">
        <div></div>
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
                    style={{ borderLeft: `10px solid ${task.colour || "#f8f8f8"}` }}
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

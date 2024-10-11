/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Task = ({ notify, taskid, popup, setPopup }) => {
  const [updateBool, updateInfo] = useState(false);
  const [username, setUsername] = useState("");
  const [task, setTask] = useState({
    name: "",
    app: "",
    plan: {},
    state: "open",
    creator: "",
    owner: "",
    createdate: Date().toISOString.split("T")[0],
    description: "",
    notes: "",
  });
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/viewProfile")
      .then(res => {
        setTask({ ...task, creator: res.data.username, owner: res.data.username });
      })
      .catch(navigate("/login"));

    setPlans([
      { value: "a", label: "a" },
      { value: "b", label: "b" },
      { value: "c", label: "c" },
    ]);
  }, [navigate, task]);

  const closeCreateTask = () => setPopup("");

  const handleCreate = () => {
    notify("Task created", true);
    closeCreateTask();
  };

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "createtask"} onRequestClose={closeCreateTask}>
      <main className="main">
        <button className="close" onClick={closeCreateTask}>
          X
        </button>
        <table className="task">
          <tbody>
            <tr>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <p>
                  <strong> Task name: </strong>
                  <input type="text" value={task.name} onChange={e => setTask({ ...task, name: e.target.value })}></input>
                </p>
                <p>
                  <strong> task plan: </strong>
                  <Select
                    isClearable
                    value={task.plan}
                    options={plans}
                    onChange={e => {
                      setTask({ ...task, plan: e });
                    }}
                  />
                </p>
                <p>
                  <strong> State: </strong> {task.state}
                </p>
                <p>
                  <strong> Creator: </strong> {task.creator}
                </p>
                <p>
                  <strong> Owner: </strong> {task.owner}
                </p>
                <p>
                  <strong> Created On: </strong>
                  <input type="date" value={task.createdate} disabled></input>
                </p>
                <p>
                  <strong> Description: </strong>
                  {task.description}
                </p>
              </td>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <p>
                  <strong> Add Notes: </strong>
                  <textarea rows={15} cols={110} value={task.notes} onChange={e => setTask({ ...task, notes: e.target.value })}></textarea>
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="actions">
          <button onClick={handleCreate}>Create Task</button>
          <button onClick={closeCreateTask}>Cancel</button>
        </div>
      </main>
    </Modal>
  );
};

export default Task;

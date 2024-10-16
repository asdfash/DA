/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

Modal.setAppElement("#root");

const Task = ({ notify, taskid, popup, setPopup }) => {
  const [updateBool, updateInfo] = useState(false);
  const [task, setTask] = useState({
    id: "",
    name: "",
    app_acronym: "",
    plan: {},
    state: "open",
    creator: "",
    owner: "",
    createdate: "",
    description: "",
    notes: "",
  });

  const buttons = {
    open: { promote: "Release" },
    todo: { promote: "Pickup" },
    doing: { promote: "Seek Approval", demote: "Giveup" },
    done: { promote: "Approve", demote: "Reject" },
    closed:{}
  };

  const [plans, setPlans] = useState([]);
  const [editTask, setEditTask] = useState({
    plans: "",
    notes: "",
  });

  useEffect(() => {
    if (taskid) {
      axios.post("/viewtask", { id: taskid }).then(res => {
        setTask(res.data);
        setEditTask({
          plan: res.data.plan,
          notes: "",
        });
        axios.post("/viewplanlist", { app_acronym: res.data.app_acronym }).then(res => setPlans(res.data));
      });
    }
  }, [taskid, updateBool]);

  const cancelTask = () => setPopup("");
  const saveTask = () => {
    notify("task saved", true);
    setPopup("");
  };

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "task"} onAfterOpen={() => updateInfo(!updateBool)} onRequestClose={cancelTask}>
      <main className="main">
        <button className="close" onClick={cancelTask}>
          X
        </button>
        <table className="task">
          <tbody>
            <tr>
              <td style={{ textAlign: "left", padding: "1rem", width: "30%" }}>
                <p>
                  <strong> Task name: </strong> {task.name}
                </p>
                <p>
                  <strong>Task id: </strong> {task.id}
                </p>
                <div>
                  <strong> task plan: </strong>
                  <Select
                    isClearable
                    value={editTask.plan}
                    options={plans}
                    onChange={e => {
                      setEditTask({ ...editTask, plan: e });
                    }}
                  />
                </div>
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
                  <strong> Created on: </strong>
                  <input type="date" value={task.createdate} disabled></input>
                </p>
                <p>
                  <strong> Description: </strong>
                  {task.description}
                </p>
              </td>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <strong> Notes: </strong>
                <textarea rows={25} style={{ width: "100%" }} value={task.notes} disabled></textarea>
                <p>
                  <strong> Add Notes: </strong>
                  <textarea rows={15} style={{ width: "100%" }} value={editTask.notes} onChange={e => setEditTask({ ...editTask, notes: e.target.value })}></textarea>
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="actions">
          {buttons[task.state].demote ? <button onClick={cancelTask}>Save and {buttons[task.state].demote}</button> : <></>}
          {buttons[task.state].promote ? <button onClick={cancelTask}>Save and {buttons[task.state].promote}</button> : <></>}
          <button onClick={saveTask}>Save Changes</button>
          <button onClick={cancelTask}>Cancel</button>
        </div>
      </main>
    </Modal>
  );
};

export default Task;

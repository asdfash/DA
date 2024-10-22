/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Task = ({ notify, taskid, popup, setPopup }) => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [task, setTask] = useState({
    id: "",
    name: "",
    app_acronym: "",
    plan: { label: "", value: "" },
    state: "",
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
    closed: {},
  };

  const [plans, setPlans] = useState([]);
  const [editTask, setEditTask] = useState({
    plan: { label: "", value: "" },
    notes: "",
  });

  const update = () => {
    axios
      .post("/viewtask", { id: taskid })
      .then(res => {
        setTask(res.data);
        axios
          .post("/checktaskpermission", { app_acronym: res.data.app_acronym, id: taskid, state: res.data.state })
          .then(() => {
            setEdit(true);
            setEditTask({
              plan: res.data.plan,
              notes: "",
            });
            axios.post("/viewplanlist", { app_acronym: res.data.app_acronym }).then(res => setPlans(res.data));
          })
          .catch(() => setEdit(false));
      })
      .catch(err => {
        notify(err.response.data, false);
        navigate("/login");
      });
  };

  const cancelTask = () => setPopup("");

  const saveTask = () => {
    axios
      .post("/edittask", { ...editTask, id: task.id, state: task.state, app_acronym: task.app_acronym })
      .then(() => {
        notify("task saved", true);
        update();
      })
      .catch(err => {
        notify(err.response.data, false);
        switch (err.response.status) {
          case 401:
            navigate("/login");
            break;
          case 403:
            navigate("/");
            break;
        }
      });
  };

  const promoteTask = () => {
    axios
      .post("/promotetask", { ...editTask, id: task.id, state: task.state, app_acronym: task.app_acronym })
      .then(() => {
        notify("task saved", true);
        setPopup("");
      })
      .catch(err => {
        notify(err.response.data, false);
        switch (err.response.status) {
          case 401:
            navigate("/login");
            break;
          case 403:
            navigate("/");
            break;
        }
      });
  };

  const demoteTask = () => {
    axios
      .post("/demotetask", { ...editTask, id: task.id, state: task.state, app_acronym: task.app_acronym })
      .then(() => {
        notify("task saved", true);
        setPopup("");
      })
      .catch(err => {
        notify(err.response.data, false);
        switch (err.response.status) {
          case 401:
            navigate("/login");
            break;
          case 403:
            navigate("/");
            break;
        }
      });
  };

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "task"} onAfterOpen={update} onRequestClose={cancelTask}>
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
                  {edit && (task.state === "done" || task.state === "open") ? (
                    <Select
                      isClearable
                      value={editTask.plan}
                      options={plans}
                      onChange={e => {
                        const newplan = e || { label: "", value: "" };
                        setEditTask({ ...editTask, plan: newplan });
                      }}
                    />
                  ) : (
                    task.plan.value
                  )}
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
                  <input type="date" value={task.createdate} disabled />
                </p>
                <p>
                  <strong> Description: </strong>
                  <textarea rows={20} value={task.description} disabled />
                </p>
              </td>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <strong> Notes: </strong>
                <textarea rows={25} value={task.notes} disabled />
                {edit ? (
                  <p>
                    <strong> Add Notes: </strong>
                    <textarea rows={15} value={editTask.notes} onChange={e => setEditTask({ ...editTask, notes: e.target.value })} />
                  </p>
                ) : (
                  <></>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {edit ? (
          <div className="actions">
            {buttons[task.state].demote ? <button onClick={demoteTask}>Save and {buttons[task.state].demote}</button> : <></>}
            {buttons[task.state].promote && (task.state !== "done" || task.plan.value === editTask.plan.value) ? <button onClick={promoteTask}>Save and {buttons[task.state].promote}</button> : <></>}
            {task.state !== "closed" ? (
              <>
                {task.state !== "done" || task.plan.value === editTask.plan.value ? <button onClick={saveTask}>Save Changes</button> : <></>}

                <button onClick={cancelTask}>Cancel</button>
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </main>
    </Modal>
  );
};

export default Task;

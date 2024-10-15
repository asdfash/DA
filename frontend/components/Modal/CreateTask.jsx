/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const CreateTask = ({ notify, app, popup, setPopup }) => {
  const [updateBool, updateInfo] = useState(false);
  const [username, setUsername] = useState("");
  const [task, setTask] = useState({});
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  axios
    .get("/viewProfile")
    .then(res => {
      setUsername(res.data.username);
    });

  useEffect(() => {
    setTask({ name: "", app: app, plan: {}, description: "", notes: "" });
    setPlans([
      { value: "a", label: "a" },
      { value: "bheoihfsdasoh", label: "bhefaijfhaw" },
      { value: "c", label: "c" },
    ]);
  }, [app, updateBool, navigate]);

  const cancelTask = () => setPopup("");

  const handleCreate = () => {
    notify("Task created", true);
    setPopup("");
  };

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "createtask"} onAfterOpen={() => updateInfo(!updateBool)} onRequestClose={cancelTask}>
      <main className="main">
        <button className="close" onClick={cancelTask}>
          X
        </button>
        <table className="task">
          <tbody>
            <tr>
              <td style={{ textAlign: "left", padding: "1rem", width: "30%" }}>
                <p>
                  <strong> Task name: </strong>
                  <input type="text" value={task.name} onChange={e => setTask({ ...task, name: e.target.value })}></input>
                </p>
                <p>
                  <strong> App acronym: </strong> {app}
                </p>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    <strong> Task plan: </strong>
                  </td>
                  <td style={{ borderLeft: "none" }}>
                    <Select
                      isClearable
                      value={task.plan}
                      options={plans}
                      onChange={e => {
                        setTask({ ...task, plan: e });
                      }}
                    />
                  </td>
                </tr>

                <p>
                  <strong> State: </strong> open
                </p>

                <p>
                  <strong> Creator: </strong> {username}
                </p>
                <p>
                  <strong> Owner: </strong> {username}
                </p>

                <p>
                  <strong style={{ verticalAlign: "top" }}> Description: </strong>
                  <textarea rows={15} style={{ width: "100%" }} value={task.description} onChange={e => setTask({ ...task, description: e.target.value })}></textarea>
                </p>
              </td>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <p>
                  <strong> Add Notes: </strong>
                  <textarea rows={35} style={{ width: "100%" }} value={task.notes} onChange={e => setTask({ ...task, notes: e.target.value })}></textarea>
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="actions">
          <button onClick={handleCreate}>Create Task</button>
          <button onClick={cancelTask}>Cancel</button>
        </div>
      </main>
    </Modal>
  );
};

export default CreateTask;

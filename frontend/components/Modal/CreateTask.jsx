/* eslint-disable react/prop-types */
import Modal from "react-modal";
import Select from "react-select";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const CreateTask = ({ notify, app_acronym, popup, setPopup }) => {
  const [username, setUsername] = useState("");
  const [task, setTask] = useState({ name: "" });
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const update = () => {
    axios.get("/viewProfile").then(res => {
      setUsername(res.data.username);
      axios.post("/viewplanlist", { app_acronym: app_acronym }).then(res => setPlans(res.data));
    });

    setTask({ name: "", app_acronym: app_acronym, plan: {}, description: "", notes: "" });
  };

  const cancelTask = () => setPopup("");

  const handleCreate = () => {
    axios
      .post("/addtask", task)
      .then(() => {
        notify("Task created", true);
        setTask({ name: "", app_acronym: app_acronym, plan: {}, description: "", notes: "" });
      })
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
  };

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "createtask"} onAfterOpen={update} onRequestClose={cancelTask}>
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
                  <input type="text" value={task.name} onChange={e => setTask({ ...task, name: e.target.value })} />
                </p>
                <p>
                  <strong> App acronym: </strong> {app_acronym}
                </p>
                <div>
                  <div style={{ textAlign: "Left" }}>
                    <strong> Task plan: </strong>
                  </div>
                  <div style={{ borderLeft: "none" }}>
                    <Select
                      isClearable
                      value={task.plan}
                      options={plans}
                      onChange={e => {
                        setTask({ ...task, plan: e || { value: "", label: "" } });
                      }}
                    />
                  </div>
                </div>
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
                  <textarea maxLength={255} rows={15} value={task.description} onChange={e => setTask({ ...task, description: e.target.value })} />
                </p>
              </td>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <div>
                  <strong> Notes: </strong>
                  <textarea rows={15} disabled />
                </div>
                <p>
                  <strong> Add Notes: </strong>
                  <textarea rows={25} value={task.notes} onChange={e => setTask({ ...task, notes: e.target.value })} />
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

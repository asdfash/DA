/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const CreateTask = ({ notify, app_acronym, popup, setPopup }) => {
  const [updateBool, updateInfo] = useState(false);
  const [username, setUsername] = useState("");
  const [task, setTask] = useState({
    name:""
  });
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (popup === "createtask") {
      axios.get("/viewProfile").then(res => {
        setUsername(res.data.username);
        axios.post("/viewplanlist", { app_acronym: app_acronym }).then(res => setPlans(res.data));
      });

      setTask({ name: "", app_acronym: app_acronym, plan: {}, description: "", notes: "" });
    }
  }, [app_acronym, updateBool, navigate, popup]);

  const cancelTask = () => setPopup("");

  const handleCreate = () => {
    axios
      .post("/addtask", task)
      .then(() => {
        notify("Task created", true);
        setPopup("");
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
                        setTask({ ...task, plan: e });
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

/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { useState, useEffect } from "react";
import Select from "react-select";

Modal.setAppElement("#root");

const Task = ({ notify, taskid, popup, setPopup }) => {
  const [updateBool, updateInfo] = useState(false);
  const [task, setTask] = useState({
    id: "",
    name: "",
    app: "",
    plan: {},
    state: "",
    creator: "",
    owner: "",
    createdate: "",
    description: "",
    notes: "",
  });
  const [plans, setPlans] = useState([]);
  const [editTask, setEditTask] = useState({
    plans: "",
    notes: "",
  });
  useEffect(() => {
    setTask({
      id: "ss001",
      name: "eat food",
      app: "ss",
      plan: { value: "sheep", label: "sheep" },
      state: "open",
      creator: "xx",
      owner: "yy",
      createddate: "2024-12-31",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,",
      notes: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,".repeat(20),
    });
    setPlans([
      { value: "a", label: "a" },
      { value: "b", label: "b" },
      { value: "c", label: "c" },
    ]);
  }, [updateBool]);
  const closeTask = () => setPopup("");

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "task"} onRequestClose={closeTask}>
      <main className="main">
        <button className="close" onClick={closeTask}>
          X
        </button>
        <table className="task">
          <tbody>
            <tr>
              <td style={{ textAlign: "left", paddingLeft: "1rem" }}>
                <p>
                  <strong> Task name: </strong> {task.name}
                </p>
                <p>
                  <strong>Task id: </strong> {task.id}
                </p>
                <p>
                  <strong> task plan: </strong>
                  <Select
                    isClearable
                    value={editTask.plan}
                    options={plans}
                    onChange={e => {
                      setEditTask({ ...editTask, plan: e });
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
                <strong> Notes: </strong>
                <textarea rows={25} cols={110} value={task.notes} disabled></textarea>
                <p>
                  <strong> Add Notes: </strong>
                  <textarea rows={15} cols={110} value={editTask.notes} onChange={e => setEditTask({ ...editTask, notes: e.target.value })}></textarea>
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="actions">
          <button onClick={closeTask}>Save and A1</button>
          <button onClick={closeTask}>Save and A2</button>
          <button onClick={closeTask}>Save Changes</button>
          <button onClick={closeTask}>Cancel</button>
        </div>
      </main>
    </Modal>
  );
};

export default Task;

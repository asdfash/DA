/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const App = ({ selectedApp, popup, setPopup }) => {
  const navigate = useNavigate();
  const closeApp = () => setPopup("");

  useEffect(() => {
    if (popup == "app") {
      axios.get("/verify").catch(() => navigate("/login"));
    }
  }, [navigate, popup, selectedApp, selectedApp.acronym]);
  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "app"} onRequestClose={closeApp}>
      <main className="main">
        <button className="close" onClick={closeApp}>
          X
        </button>
        <table className="task">
          <tbody>
            <tr>
              <td>
                <p>
                  <strong> App Acronym: </strong> {selectedApp.acronym}
                </p>
                <p>
                  <strong> Start Date: </strong>
                  <input type="date" value={selectedApp.startdate} disabled></input>
                </p>
                <p>
                  <strong> End Date: </strong>
                  <input type="date" value={selectedApp.enddate} disabled></input>
                </p>
                <h4>Task Permissions:</h4>
                <p>
                  <strong> Create: </strong> {selectedApp.taskcreate ? selectedApp.taskcreate.value : ""}
                </p>
                <p>
                  <strong> Open: </strong> {selectedApp.taskopen ? selectedApp.taskopen.value : ""}
                </p>
                <p>
                  <strong> Todo: </strong> {selectedApp.tasktodo ? selectedApp.tasktodo.value : ""}
                </p>
                <p>
                  <strong> Doing: </strong> {selectedApp.taskdoing ? selectedApp.taskdoing.value : ""}
                </p>
                <p>
                  <strong> Done: </strong> {selectedApp.taskdone ? selectedApp.taskdone.value : ""}
                </p>
              </td>
              <td>
                <div>
                  <strong> Description: </strong>
                  <pre>{selectedApp.description}</pre>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </Modal>
  );
};

export default App;

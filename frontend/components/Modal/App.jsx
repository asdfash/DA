/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const App = ({ app_acronym, notify, popup, setPopup }) => {
  const navigate = useNavigate();
  const [app, setApp] = useState({
    acronym: "",
    rnumber: "",
    startdate: "",
    enddate: "",
    taskcreate: {},
    tasktodo: {},
    taskdone: {},
    taskopen: {},
    taskdoing: {},
  });
  const closeApp = () => setPopup("");

  useEffect(() => {
    if (popup == "app") {
      axios
        .get("/viewapps")
        .then(res => {
          setApp(res.data.find(app => app.acronym === app_acronym));
        })
        .catch(err => {
          err.response.status === 401 ? navigate("/login") : notify(err.response.data, false);
        });
    }
  }, [app_acronym, navigate, notify, popup]);
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
                  <strong> App Acronym: </strong> {app.acronym}
                </p>
                <p>
                  <strong> R Number: </strong> {app.rnumber}
                </p>
                <p>
                  <strong> Start Date: </strong>
                  <input type="date" value={app.startdate} disabled></input>
                </p>
                <p>
                  <strong> End Date: </strong>
                  <input type="date" value={app.enddate} disabled></input>
                </p>
                <h4>Task Permissions:</h4>
                <p>
                  <strong> Create: </strong> {app.taskcreate.value}
                </p>
                <p>
                  <strong> Open: </strong> {app.taskopen.value}
                </p>
                <p>
                  <strong> Todo: </strong> {app.tasktodo.value}
                </p>
                <p>
                  <strong> Doing: </strong> {app.taskdoing.value}
                </p>
                <p>
                  <strong> Done: </strong> {app.taskdone.value}
                </p>
              </td>
              <td>
                <p>
                  <strong> Description: </strong> 
                  <pre>{app.description}</pre>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </Modal>
  );
};

export default App;

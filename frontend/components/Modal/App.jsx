/* eslint-disable react/prop-types */
import Modal from "react-modal";

Modal.setAppElement('#root');

const App = ({ selectedApp, popup, setPopup }) => {
  const closeApp = () => setPopup('');
  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup==='app'} onRequestClose={closeApp}>
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
                  <strong> R Number: </strong> {selectedApp.rnumber}
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
                  <strong> Create: </strong> {selectedApp.taskcreate.value}
                </p>
                <p>
                  <strong> Open: </strong> {selectedApp.taskopen.value}
                </p>
                <p>
                  <strong> Todo: </strong> {selectedApp.tasktodo.value}
                </p>
                <p>
                  <strong> Doing: </strong> {selectedApp.taskdoing.value}
                </p>
                <p>
                  <strong> Done: </strong> {selectedApp.taskdone.value}
                </p>
              </td>
              <td>
                <p>
                  <strong> Description: </strong> {selectedApp.description}
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

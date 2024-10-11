/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import popups
import Planlist from "./Planlist";

const Tasklist = ({ notify, app }) => {
  const headers = ["open", "todo", "doing", "done", "closed"];
  const [planOpen, setPlanOpen] = useState(false);
  const [isPL, setIsPL] = useState(false);
  const navigate = useNavigate();

  //on mount
  useEffect(() => {
    if (!app) {
      navigate("/");
    }
    axios
      .post("/checkgroup", { group: "pl" })
      .then(() => setIsPL(true))
      .catch(() => setIsPL(false));
  }, [app, navigate]);
  return (
    <main className="main">
      <Planlist notify={notify} app={app} planOpen={planOpen} setPlanOpen={setPlanOpen} />
      <div className="split">
        <div>
          <strong>{app}</strong> | <button onClick={() => setPlanOpen(true)}> details</button>
        </div>
        <div>
          <button onClick={() => setPlanOpen(true)}>Plans</button> {isPL ? <button onClick={() => setPlanOpen(true)}>Create Task</button> : ""}
        </div>
      </div>

      <table className="task">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* ensure that lines show */}
          <tr>
            {headers.map(header => (
              <td key={header}>
                <div className="card">a</div>
                <div className="card">{header === "open" ? "b" : ""}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </main>
  );
};

export default Tasklist;

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Planlist = ({ notify, selectedApp, popup, setPopup }) => {
  const [updateBool, updateInfo] = useState(false);
  const [isPM, setIsPM] = useState();
  const headers = ["MVP Name", "Start Date", "End Date", "Colour"];
  const [createPlan, setCreatePlan] = useState({
    mvpname: "",
    startdate: "",
    enddate: "",
    colour: "#ffffff",
  });
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedApp.acronym) {
      navigate("/");
    }
    axios
      .post("/checkgroup", { group: "pm" })
      .then(() => setIsPM(true))
      .catch(() => setIsPM(false));

    axios
      .post("/viewplans", { acronym: selectedApp.acronym })
      .then(res => setPlans(res.data))
      .catch(err => {
        switch (err.response.status) {
          case 401:
            navigate("/login");
            break;
          case 403:
            navigate("/");
            break;
        }
      });
  }, [updateBool, navigate, selectedApp.acronym]);

  const handleCreate = e => {
    e.preventDefault();
    axios
      .post("/addplan", { ...createPlan, acronym: selectedApp.acronym })
      .then(() => {
        setCreatePlan({
          mvpname: "",
          startdate: "",
          enddate: "",
          colour: "#ffffff",
        });
        notify("plan created", true);
        updateInfo(!updateBool);
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
            updateInfo(!updateBool);
        }
      });
  };
  const closePlans = () => setPopup("");

  return (
    <Modal style={{ overlay: { zIndex: 20 } }} isOpen={popup === "planlist"} onAfterOpen={() => updateInfo(!updateBool)} onRequestClose={closePlans}>
      <main className="main">
        <button className="close" onClick={closePlans}>
          X
        </button>
        <table className="table">
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
              <th key={"Create Plan"}>{isPM ? "Create Plan" : ""}</th>
            </tr>
          </thead>
          <tbody>
            {isPM ? (
              <tr>
                <td>
                  <input type="text" value={createPlan.mvpname} maxLength={50} onChange={e => setCreatePlan({ ...createPlan, mvpname: e.target.value })} />
                </td>
                <td>
                  <input className="date" type="date" value={createPlan.startdate} onChange={e => setCreatePlan({ ...createPlan, startdate: e.target.value })}></input>
                </td>
                <td>
                  <input className="date" type="date" value={createPlan.enddate} onChange={e => setCreatePlan({ ...createPlan, enddate: e.target.value })}></input>
                </td>
                <td>
                  <input type="color" value={createPlan.colour} onChange={e => setCreatePlan({ ...createPlan, colour: e.target.value })}></input>
                </td>
                <td>
                  <button onClick={handleCreate}>Create</button>
                </td>
              </tr>
            ) : (
              <></>
            )}
            {plans.map(plan => (
              <tr key={plan.mvpname}>
                <td>{plan.mvpname}</td>
                <td>
                  <input className="date" type="date" value={plan.startdate} disabled></input>
                </td>
                <td>
                  <input className="date" type="date" value={plan.enddate} disabled></input>
                </td>
                <td>
                  <input type="color" value={plan.colour} disabled></input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Modal>
  );
};

export default Planlist;

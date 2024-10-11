/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

const Planlist = ({ notify, app }) => {
  const [updateBool, updateInfo] = useState(false);
  const [planOpen, setPlanOpen] = useState(true);
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
    if (!app){
      navigate('/')
    }
    axios
      .post("/checkgroup", { group: "pm" })
      .then(() => setIsPM(true))
      .catch(() => setIsPM(false));

    
    setPlans([
      {
        mvpname: "ssss",
        startdate: "2024-12-23",
        enddate: "2025-11-23",
        colour: "#0101a1",
      },
      {
        mvpname: "xxxx",
        startdate: "2024-12-23",
        enddate: "2025-11-23",
        colour: "#02a001",
      },
      {
        mvpname: "yyyy",
        startdate: "2024-12-23",
        enddate: "2025-11-23",
        colour: "#a10101",
      },
    ]);
  }, [updateBool, navigate, app]);

  const handleCreate = e => {
    e.preventDefault();
    console.log(createPlan);
    setCreatePlan({
      mvpname: "",
      startdate: "",
      enddate: "",
      colour: "#ffffff",
    });
    notify("plan created", true);
    updateInfo(!updateBool);
  };
  const closePlans = () => {
    setPlanOpen(false);
    navigate("/app");
  };

  return (
    <Modal isOpen={planOpen} onRequestClose={closePlans} overlayClassName="overlay">
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

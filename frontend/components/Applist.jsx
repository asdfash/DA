/* eslint-disable react/prop-types */
import Select from "react-select";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Applist = ({ notify, setAppAcronym }) => {
  const [isPL, setIsPL] = useState();
  const headers = ["Acronym", "Running Number", "Start Date", "End Date", "Task Create", "Task Open", "Task To Do", "Task Doing", "Task Done", "Description"];
  const [createApp, setCreateApp] = useState({
    app_acronym: "",
    rnumber: "",
    description: "",
    startdate: "",
    enddate: "",
    taskcreate: { label: "", value: "" },
    taskopen: { label: "", value: "" },
    tasktodo: { label: "", value: "" },
    taskdoing: { label: "", value: "" },
    taskdone: { label: "", value: "" },
  });
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();
  const [editApp, setEditApp] = useState({
    app_acronym: "",
    taskcreate: { label: "", value: "" },
    taskopen: { label: "", value: "" },
    tasktodo: { label: "", value: "" },
    taskdoing: { label: "", value: "" },
    taskdone: { label: "", value: "" },
  });

  const update = () => {
    setAppAcronym("");
    axios
      .post("/checkgroup", { group: "pl" })
      .then(() => setIsPL(true))
      .catch(() => setIsPL(false));

    axios
      .get("/viewGroups")
      .then(res => {
        setGroups(res.data);
      })
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
    axios
      .get("/viewapps")
      .then(res => setApps(res.data))
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
  };
  useEffect(update, [navigate, setAppAcronym]);

  const handleCreate = e => {
    e.preventDefault();
    axios
      .post("/addapp", createApp)
      .then(() => {
        setCreateApp({
          app_acronym: "",
          rnumber: 0,
          description: "",
          startdate: "",
          enddate: "",
          taskcreate: { label: "", value: "" },
          taskopen: { label: "", value: "" },
          tasktodo: { label: "", value: "" },
          taskdoing: { label: "", value: "" },
          taskdone: { label: "", value: "" },
        });
        notify("app created", true);
        update();
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
            update();
        }
      });
  };

  const handleSave = () => {
    axios
      .post("/editapp", editApp)
      .then(() => {
        setEditApp({});
        notify("app edited", true);
        update();
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
            update();
        }
      });
  };

  const handleViewTasks = app_acronym => {
    setAppAcronym(app_acronym);
    navigate("/app");
  };

  const handleEdit = app => {
    update();
    setEditApp(app);
  };
  return (
    <main className="main">
      <table className="table">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
            <th key={"Open App"}>{isPL ? "Create/ Open App" : "Open App"}</th>
          </tr>
        </thead>
        <tbody>
          {/* create app */}
          {isPL ? (
            <tr>
              <td>
                <input type="text" size={10} maxLength={50} value={createApp.app_acronym} onChange={e => setCreateApp({ ...createApp, app_acronym: e.target.value })} autoFocus />
              </td>
              <td>
                <input type="text" min={0} step={1} value={createApp.rnumber} onChange={e => setCreateApp({ ...createApp, rnumber: e.target.value })} />
              </td>

              <td>
                <input className="date" type="date" value={createApp.startdate} onChange={e => setCreateApp({ ...createApp, startdate: e.target.value })} />
              </td>
              <td>
                <input className="date" type="date" value={createApp.enddate} onChange={e => setCreateApp({ ...createApp, enddate: e.target.value })} />
              </td>

              <td>
                <Select
                  value={createApp.taskcreate}
                  options={groups}
                  onChange={e => {
                    const value = e || { label: "", value: "" };
                    setCreateApp({ ...createApp, taskcreate: value });
                  }}
                  isClearable
                />
              </td>
              <td>
                <Select
                  value={createApp.taskopen}
                  options={groups}
                  onChange={e => {
                    const value = e || { label: "", value: "" };
                    setCreateApp({ ...createApp, taskopen: value });
                  }}
                  isClearable
                />
              </td>
              <td>
                <Select
                  value={createApp.tasktodo}
                  options={groups}
                  onChange={e => {
                    const value = e || { label: "", value: "" };
                    setCreateApp({ ...createApp, tasktodo: value });
                  }}
                  isClearable
                />
              </td>
              <td>
                <Select
                  value={createApp.taskdoing}
                  options={groups}
                  onChange={e => {
                    const value = e || { label: "", value: "" };
                    setCreateApp({ ...createApp, taskdoing: value });
                  }}
                  isClearable
                />
              </td>
              <td>
                <Select
                  value={createApp.taskdone}
                  options={groups}
                  onChange={e => {
                    const value = e || { label: "", value: "" };
                    setCreateApp({ ...createApp, taskdone: value });
                  }}
                  isClearable
                />
              </td>
              <td>
                <textarea rows={5} cols={51} maxLength={255} value={createApp.description} onChange={e => setCreateApp({ ...createApp, description: e.target.value })} />
              </td>
              {/* <td></td> */}
              <td>
                <button onClick={handleCreate}>Create</button>
              </td>
            </tr>
          ) : (
            <></>
          )}
          {apps.map(app => (
            <tr key={app.app_acronym}>
              <td>{app.app_acronym}</td>
              <td>{app.rnumber}</td>
              {editApp.app_acronym === app.app_acronym ? (
                <>
                  <td>
                    <input className="date" type="date" value={editApp.startdate} onChange={e => setEditApp({ ...editApp, startdate: e.target.value })} />
                  </td>
                  <td>
                    <input className="date" type="date" value={editApp.enddate} onChange={e => setEditApp({ ...editApp, enddate: e.target.value })} />
                  </td>
                  <td>
                    <Select
                      value={editApp.taskcreate}
                      options={groups}
                      onChange={e => {
                        const value = e || { label: "", value: "" };
                        setEditApp({ ...editApp, taskcreate: value });
                      }}
                      isClearable
                    />
                  </td>
                  <td>
                    <Select
                      value={editApp.taskopen}
                      options={groups}
                      onChange={e => {
                        const value = e || { label: "", value: "" };
                        setEditApp({ ...editApp, taskopen: value });
                      }}
                      isClearable
                    />
                  </td>
                  <td>
                    <Select
                      value={editApp.tasktodo}
                      options={groups}
                      onChange={e => {
                        const value = e || { label: "", value: "" };
                        setEditApp({ ...editApp, tasktodo: value });
                      }}
                      isClearable
                    />
                  </td>
                  <td>
                    <Select
                      value={editApp.taskdoing}
                      options={groups}
                      onChange={e => {
                        const value = e || { label: "", value: "" };
                        setEditApp({ ...editApp, taskdoing: value });
                      }}
                      isClearable
                    />
                  </td>
                  <td>
                    <Select
                      value={editApp.taskdone}
                      options={groups}
                      onChange={e => {
                        const value = e || { label: "", value: "" };
                        setEditApp({ ...editApp, taskdone: value });
                      }}
                      isClearable
                    />
                  </td>
                  <td>
                    <textarea rows={5} cols={51} maxLength={255} value={editApp.description} onChange={e => setEditApp({ ...editApp, description: e.target.value })} />
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <br />
                    <button onClick={() => handleEdit({ taskcreate: { label: "", value: "" }, taskopen: { label: "", value: "" }, tasktodo: { label: "", value: "" }, taskdoing: { label: "", value: "" }, taskdone: { label: "", value: "" } })}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <input className="date" type="date" value={app.startdate} disabled />
                  </td>
                  <td>
                    <input className="date" type="date" value={app.enddate} disabled />
                  </td>
                  <td>{app.taskcreate.value}</td>
                  <td>{app.taskopen.value}</td>
                  <td>{app.tasktodo.value}</td>
                  <td>{app.taskdoing.value}</td>
                  <td>{app.taskdone.value}</td>
                  <td>
                    <textarea style={{ resize: "vertical" }} rows={4} cols={51} value={app.description} disabled />
                  </td>
                  <td>
                    <button onClick={() => handleViewTasks(app.app_acronym)}>Open</button>
                    <br />
                    <button onClick={() => handleEdit(app)}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Applist;

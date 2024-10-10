/* eslint-disable react/prop-types */
import Select from "react-select";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Applist = ({ notify, setApp }) => {
  const [updateBool, updateInfo] = useState(false);
  const [isPL, setIsPL] = useState();
  const headers = ["Acronym", "Running Number", "Start Date", "End Date", "Task Create", "Task Open", "Task To Do", "Task Doing", "Task Done", "Description"];
  const [createApp, setCreateApp] = useState({
    acronym: "",
    description: "",
    startdate: "",
    enddate: "",
    taskcreate: [],
    taskopen: [],
    tasktodo: [],
    taskdoing: [],
    taskdone: [],
  });
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setApp("");
    axios
      .post("/checkgroup", { group: "pl" })
      .then(() => setIsPL(true))
      .catch(() => setIsPL(false));
    setApps([
      {
        acronym: "ssss",
        rnumber: 0,
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,",
        startdate: "2024-12-23",
        enddate: "2025-11-23",
        taskcreate: { value: "pm", label: "pm" },
        taskopen: { value: "pm", label: "pm" },
        tasktodo: { value: "pm", label: "pm" },
        taskdoing: { value: "pm", label: "pm" },
        taskdone: { value: "pm", label: "pm" },
      },
      {
        acronym: "xyy",
        rnumber: 0,
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,",
        startdate: "2024-12-23",
        enddate: "2025-11-23",
        taskcreate: { value: "pm", label: "pm" },
        taskopen: { value: "pm", label: "pm" },
        tasktodo: { value: "pm", label: "pm" },
        taskdoing: { value: "pm", label: "pm" },
        taskdone: { value: "pm", label: "pm" },
      },
      {
        acronym: "zzz",
        rnumber: 0,
        description: "esque eu, pretium quis",
        startdate: "2024-12-23",
        enddate: "2025-11-23",
        taskcreate: { value: "pm", label: "pm" },
        taskopen: { value: "pm", label: "pm" },
        tasktodo: { value: "pm", label: "pm" },
        taskdoing: { value: "pm", label: "pm" },
        taskdone: { value: "pm", label: "pm" },
      },
    ]);
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
  }, [updateBool, navigate, setApp]);

  const handleCreate = e => {
    e.preventDefault();
    console.log(createApp);
    setCreateApp({
      acronym: "",
      description: "",
      startdate: "",
      enddate: "",
      taskcreate: [],
      taskopen: [],
      tasktodo: [],
      taskdoing: [],
      taskdone: [],
    });
    notify("app created", true);
    updateInfo(!updateBool);
  };

  const handleView = app => {
    setApp(app.acronym);
    navigate("/app");
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
                <input type="text" size={10} maxLength={50} value={createApp.acronym} onChange={e => setCreateApp({ ...createApp, acronym: e.target.value })} />
              </td>
              <td>0</td>
              <td>
                <input className="date" type="date" value={createApp.startdate} onChange={e => setCreateApp({ ...createApp, startdate: e.target.value })}></input>
              </td>
              <td>
                <input className="date" type="date" value={createApp.enddate} onChange={e => setCreateApp({ ...createApp, enddate: e.target.value })}></input>
              </td>

              <td>
                <Select
                  value={createApp.taskcreate}
                  options={groups}
                  onChange={e => {
                    setCreateApp({ ...createApp, taskcreate: e });
                  }}
                />
              </td>
              <td>
                <Select
                  value={createApp.taskopen}
                  options={groups}
                  onChange={e => {
                    setCreateApp({ ...createApp, taskopen: e });
                  }}
                />
              </td>
              <td>
                <Select
                  value={createApp.tasktodo}
                  options={groups}
                  onChange={e => {
                    setCreateApp({ ...createApp, tasktodo: e });
                  }}
                />
              </td>
              <td>
                <Select
                  value={createApp.taskdoing}
                  options={groups}
                  onChange={e => {
                    setCreateApp({ ...createApp, taskdoing: e });
                  }}
                />
              </td>
              <td>
                <Select
                  value={createApp.taskdone}
                  options={groups}
                  onChange={e => {
                    setCreateApp({ ...createApp, taskdone: e });
                  }}
                />
              </td>
              <td>
                <textarea rows={5} cols={51} maxLength={255} value={createApp.description} onChange={e => setCreateApp({ ...createApp, description: e.target.value })}></textarea>
              </td>
              <td>
                <button onClick={handleCreate}>Create</button>
              </td>
            </tr>
          ) : (
            <></>
          )}
          {apps.map(app => (
            <tr key={app.acronym}>
              <td>{app.acronym}</td>
              <td>{app.rnumber}</td>
              <td>
                <input className="date" type="date" value={app.startdate} disabled></input>
              </td>
              <td>
                <input className="date" type="date" value={app.enddate} disabled></input>
              </td>
              <td>{app.taskcreate.value}</td>
              <td>{app.taskopen.value}</td>
              <td>{app.tasktodo.value}</td>
              <td>{app.taskdoing.value}</td>
              <td>{app.taskdone.value}</td>
              <td>{app.description.length <= 50 ? app.description : app.description.slice(0, 50) + "..."}</td>
              <td>
                <button onClick={() => handleView(app)}>Open</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Applist;

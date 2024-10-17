/* eslint-disable react/prop-types */
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const UMS = ({ notify }) => {
  const headers = ["username", "password", "email", "group", "isActive", "create/edit"];
  const [updateBool, updateInfo] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [createUser, setCreateUser] = useState({
    username: "",
    password: "",
    email: "",
    groups: [],
    isActive: true,
  });
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    //groups
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
    // users
    axios
      .get("/viewUsers")
      .then(res => setUsers(res.data))
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
  }, [updateBool, navigate]);

  const handleNewGroup = e => {
    e.preventDefault();
    axios
      .post("/addGroup", {
        group: newGroup,
      })
      .then(() => {
        setNewGroup("");
        notify("group created", true);
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

  const handleCreate = e => {
    e.preventDefault();
    //todo sent for validation
    axios
      .post("/addUser", {
        username: createUser.username,
        password: createUser.password,
        email: createUser.email,
        isActive: createUser.isActive,
        groups: createUser.groups,
      })
      .then(() => {
        setCreateUser({
          username: "",
          password: "",
          email: "",
          groups: [],
          isActive: true,
        });
        notify("user created", true);
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

  const handleEdit = user => {
    updateInfo(!updateBool);
    setEditUser(user);
  };

  const handleSave = e => {
    e.preventDefault();
    axios
      .patch("/editUser", {
        username: editUser.username,
        password: editUser.password,
        email: editUser.email,
        isActive: editUser.isActive,
        groups: editUser.groups,
      })
      .then(() => {
        setEditUser({});
        notify("user saved", true);
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
        }
      });
  };

  const handleCancel = e => {
    e.preventDefault();
    setEditUser({});
    updateInfo(!updateBool);
  };

  return (
    <main className="main center">
      <form onSubmit={handleNewGroup}>
        New Group: <input type="text" value={newGroup} onChange={e => setNewGroup(e.target.value)} />
        <button type="submit"> + </button>
      </form>

      <table className="table">
      <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* create user */}
          <tr>
            <td>
              <input type="text" value={createUser.username} onChange={e => setCreateUser({ ...createUser, username: e.target.value })} />
            </td>
            <td>
              <input type="password" value={createUser.password} onChange={e => setCreateUser({ ...createUser, password: e.target.value })} />
            </td>
            <td>
              <input type="email" value={createUser.email} onChange={e => setCreateUser({ ...createUser, email: e.target.value })} />
            </td>
            <td>
              <Select
                isMulti
                value={createUser.groups}
                closeMenuOnSelect={false}
                options={groups}
                isClearable
                onChange={e => {
                  setCreateUser({ ...createUser, groups: e });
                }}
              />
            </td>
            <td>
              <input type="checkbox" checked={createUser.isActive} onChange={e => setCreateUser({ ...createUser, isActive: e.target.checked })} />
            </td>
            <td>
              <button onClick={handleCreate}>Create</button>
            </td>
          </tr>
          {/* edit user */}
          {users.map(user => (
            <tr key={user.username}>
              {editUser.username === user.username ? (
                <>
                  <td>{user.username}</td>
                  <td>
                    <input type="password" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} />
                  </td>
                  <td>
                    <input type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
                  </td>
                  <td>
                    <Select
                      isMulti
                      value={editUser.groups}
                      closeMenuOnSelect={false}
                      options={groups}
                      isClearable
                      onChange={e => {
                        setEditUser({ ...editUser, groups: e });
                      }}
                    />
                  </td>
                  <td>
                    <input type="checkbox" checked={editUser.isActive} onChange={e => setEditUser({ ...editUser, isActive: e.target.checked })} />
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                // view only
                <>
                  <td>{user.username}</td>
                  <td>******</td>
                  <td>{user.email}</td>
                  <td key={user.group}>
                    <Select isMulti value={user.groups} isDisabled />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.isActive}
                      disabled //Make checkbox in read-only mode
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
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

// eslint-disable-next-line react-refresh/only-export-components
export default UMS;

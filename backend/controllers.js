import { db } from "./mysql.js";

// helper functions
const editAccounts = async (req, username, fields) => {
  req.body.active ? (req.body.active = 1) : (req.body.active = 0);
  const update = fields.map(field => `${field} = '${req.body[field]}'`).join(", ");
  try {
    await db.execute(`update accounts set ${update} where username =  ? `, [username]);
    return true;
  } catch (error) {
    return false;
  }
};

const addGroups = (groups, username) => {
  groups.forEach(async group => {
    await db.execute("insert into `user_groups` values (?,?)", [group, username || null]);
  });
};

//logout
export const logoutController = (req, res) => {
  res.clearCookie("token").send("done");
};

//profile
export const viewProfileController = async (req, res) => {
  const [[profile]] = await db.execute("select * from accounts where username = ?", [req.username]);
  res.json({ username: profile.username, email: profile.email });
};

export const editEmailController = (req, res) => {
  editAccounts(req, req.username, ["email"]) ? res.send("edited") : res.status(500).send("error updating email");
};

export const editPasswordController = (req, res) => {
  editAccounts(req, req.username, ["password"]) ? res.send("edited") : res.status(500).send("error updating password");
};

//UMS
export const addUserController = async (req, res) => {
  await db.execute("INSERT INTO `accounts` (`username`, `password`, `email` , `active`) VALUES (?,?,?,?); ", [req.body.username, req.body.password, req.body.email, req.body.active]);
  if (req.body.groups) {
    addGroups(
      req.body.groups.map(item => item.value),
      req.body.username
    );
  }
  res.send("user created");
};

export const editUserController = async (req, res) => {
  editAccounts(req, req.body.username, req.skipPassword ? ["email", "active"] : ["password", "email", "active"]);
  if (req.body.groups) {
    await db.execute("delete from user_groups where username = ? ", [req.body.username]);
    addGroups(
      req.body.groups.map(item => item.value),
      req.body.username
    );
  }
  res.send("user edited");
};

export const viewUsersController = async (req, res) => {
  const [profiles] = await db.execute("SELECT * from `accounts`");
  for (const profile of profiles) {
    const [grouparray] = await db.execute({ sql: `select distinct groupname from user_groups where username = ?`, rowsAsArray: true }, [profile.username]);
    profile.groups = grouparray.flat().map(group => ({ value: group, label: group })) || null;
    profile.password = "";
  }
  res.json(profiles);
};
export const viewGroupsController = async (req, res) => {
  const [grouparray] = await db.execute({ sql: `select distinct groupname from user_groups`, rowsAsArray: true });
  const groups = grouparray.flat().map(group => ({ value: group, label: group }));
  res.json(groups);
};

export const AddGroupsController = async (req, res) => {
  addGroups([req.body.group]);
  res.send("ok");
};

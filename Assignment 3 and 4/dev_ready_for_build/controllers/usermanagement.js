import db from "../utils/mysql.js";

// helper functions
const editAccounts = async (req, username, fields) => {
  req.body.isActive = req.body.isActive ? 1 : 0;
  const update = fields.map(field => `${field} = '${req.body[field]}'`).join(", ");
  try {
    await db.execute(`update accounts set ${update} where username =  ? `, [username]);
  } catch (error) {
    return error;
  }
};

const addGroups = (groups, username) => {
  groups.forEach(async group => {
    try {
      await db.execute("insert into `user_groups` values (?,?)", [group, username || ""]);
    } catch (error) {
      return "err";
    }
  });
};

//logout
export const logoutController = (req, res) => {
  res.clearCookie("token").send("done");
};

//profile
export const viewProfileController = async (req, res) => {
  try {
    const [[profile]] = await db.execute("select * from accounts where username = ?", [req.username]);
    res.json({ username: profile.username, email: profile.email });
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }
};

export const editEmailController = (req, res) => {
  try {
    editAccounts(req, req.username, ["email"]);
    res.send("edited");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const editPasswordController = (req, res) => {
  try {
    editAccounts(req, req.username, ["password"]);
    res.send("edited");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

//UMS
export const addUserController = async (req, res) => {
  try {
    await db.execute("INSERT INTO `accounts` (`username`, `password`, `email` , `isActive`) VALUES (?,?,?,?); ", [req.body.username, req.body.password, req.body.email, req.body.isActive]);
    if (req.body.groups) {
      addGroups(
        req.body.groups.map(item => item.value),
        req.body.username
      );
    }
    res.send("user created");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const editUserController = async (req, res) => {
  try {
    editAccounts(req, req.body.username, req.skipPassword ? ["email", "isActive"] : ["password", "email", "isActive"]);
    if (req.body.groups) {
      await db.execute("delete from user_groups where username = ? ", [req.body.username]);
      addGroups(
        req.body.groups.map(item => item.value),
        req.body.username
      );
    }
    res.send("user edited");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const viewUsersController = async (req, res) => {
  try {
    const [profiles] = await db.execute("SELECT * from `accounts`");
    for (const profile of profiles) {
      const [grouparray] = await db.execute({ sql: `select distinct groupname from user_groups where username = ?`, rowsAsArray: true }, [profile.username]);
      profile.groups = grouparray.flat().map(group => ({ value: group, label: group })) || null;
      profile.password = "";
      profile.id = null;
    }
    res.json(profiles);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};
export const viewGroupsController = async (req, res) => {
  try {
    const [grouparray] = await db.execute({ sql: `select distinct groupname from user_groups`, rowsAsArray: true });
    const groups = grouparray.flat().map(group => ({ value: group, label: group }));
    res.json(groups);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const AddGroupController = async (req, res) => {
  try {
    addGroups([req.body.group]);
    res.send("ok");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

import { CheckGroup } from "./middleware/auth.js";
import db from "./mysql.js";

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
      await db.execute("insert into `user_groups` values (?,?)", [group, username || null]);
    } catch (error) {
      return error;
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

//applist
export const ViewAppsController = async (req, res) => {
  try {
    const [apparray] = await db.execute("select * from application");
    const apps = [];
    apparray.forEach(app => {
      apps.push({
        acronym: app.app_acronym,
        description: app.app_description,
        rnumber: app.app_rnumber,
        startdate: app.app_startdate,
        enddate: app.app_enddate,
        taskcreate: { value: app.app_permit_create, label: app.app_permit_create },
        taskopen: { value: app.app_permit_open, label: app.app_permit_open },
        tasktodo: { value: app.app_permit_todolist, label: app.app_permit_todolist },
        taskdoing: { value: app.app_permit_doing, label: app.app_permit_doing },
        taskdone: { value: app.app_permit_done, label: app.app_permit_done },
      });
    });
    res.json(apps);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const AddAppController = async (req, res) => {
  try {
    await db.execute("INSERT INTO `application` (`app_acronym`, `app_description`, `app_rnumber` , `app_startdate`, `app_enddate`, `app_permit_create`, `app_permit_open`, `app_permit_todolist`,`app_permit_doing`,`app_permit_done`) VALUES (?,?,?,?,?,?,?,?,?,?); ", [req.body.acronym, req.body.description, 0, req.body.startdate, req.body.enddate, req.body.taskcreate.value, req.body.taskopen.value, req.body.tasktodo.value, req.body.taskdoing.value, req.body.taskdone.value]);
    res.send("app created");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

//planlist
export const ViewPlansController = async (req, res) => {
  try {
    const [planarray] = await db.execute("select * from plan where plan_app_acronym = ?", [req.body.acronym]);
    const plans = [];
    planarray.forEach(plan => {
      plans.push({
        mvpname: plan.plan_mvp_name,
        startdate: plan.plan_startdate,
        enddate: plan.plan_enddate,
        colour: plan.plan_colour,
      });
    });
    res.json(plans);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const AddPlanController = async (req, res) => {
  try {
    await db.execute("INSERT INTO `plan` (`plan_mvp_name`,`plan_app_acronym`, `plan_startdate`, `plan_enddate`,`plan_colour`) VALUES (?,?,?,?,?); ", [req.body.mvpname, req.body.acronym, req.body.startdate, req.body.enddate, req.body.colour]);
    res.send("plan created");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const CheckPermissionController = async (req, res) => {
  const permissions = {
    create: "app_permit_create",
    open: "app_permit_open",
    todo: "app_permit_todolist",
    doing: "app_permit_doing",
    done: "app_permit_done",
  };
  try {
    const [[{ group }]] = await db.execute(`select ${permissions[req.body.permission]} as \`group\` from application where app_acronym = ?`, [req.body.app_acronym]);
    const isGroup = await CheckGroup(req.username, group);
    if (isGroup === "err") {
      res.status(500).send("server error, try again later");
    } else if (isGroup) {
      res.send("permitted");
    } else {
      return res.status(403).send("user not permitted, check with admin");
    }
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

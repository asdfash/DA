import db from "../mysql.js";

export const validateUsername = async (req, res, next) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!req.body.username || !regex.test(req.body.username)) {
    return res.status(406).send("invalid username");
  }
  try {
    const [[{ count }]] = await db.execute("select count(*) as count from accounts where username = ?", [req.body.username]);
    if (count > 0) {
      return res.status(406).send("username already taken");
    }
    next();
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }
};

export const validateEmail = (req, res, next) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
  if (req.body.email && !regex.test(req.body.email)) {
    return res.status(406).send("invalid email");
  }
  next();
};

export const validateSkipPassword = (req, res, next) => {
  if (!req.body.password) {
    req.skipPassword = true;
  }
  next();
};
export const validatePassword = (req, res, next) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,10}$/;

  if (!req.skipPassword && !regex.test(req.body.password)) {
    return res.status(406).send("invalid password");
  }
  next();
};

export const validateGroupname = async (req, res, next) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(req.body.group)) {
    return res.status(406).send("invalid group name");
  }
  try {
    const [[{ count }]] = await db.execute("select count(*) as count from user_groups where groupname = ?", [req.body.group]);

    if (count > 0) {
      return res.status(406).send("group name already taken");
    }
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }

  next();
};

export const validateAdmin = (req, res, next) => {
  const grouplist = req.body.groups.map(group => group.value);
  if (req.body.username === "admin") {
    if (!grouplist.includes("admin")) return res.status(406).send("admin must be in 'admin' group ");
    if (!req.body.isActive) return res.status(406).send("admin cannot be disabled");
  }
  next();
};

export const validateCreateApp = async (req, res, next) => {
  //app_acronym
  const acronymregex = /^[a-zA-Z0-9_]+$/;
  if (!acronymregex.test(req.body.acronym)) {
    return res.status(406).send("Invalid acronym");
  }
  try {
    const [[{ count }]] = await db.execute("select count(*) as count from application where app_acronym = ?", [req.body.acronym]);

    if (count > 0) {
      return res.status(406).send("acronym already taken");
    }
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }
  //app_startdate, app_enddate
  const dateregex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!dateregex.test(req.body.startdate)) {
    return res.status(406).send("Invalid start date");
  }
  if (!dateregex.test(req.body.enddate)) {
    return res.status(406).send("Invalid end date");
  }

  try {
    const [grouparray] = await db.execute({ sql: `select distinct groupname from user_groups`, rowsAsArray: true });
    const groups = grouparray.flat();

    //permissions
    if (!groups.includes(req.body.taskcreate.value)) {
      return res.status(406).send("Invalid task create");
    }
    if (!groups.includes(req.body.taskopen.value)) {
      return res.status(406).send("Invalid task open");
    }
    if (!groups.includes(req.body.tasktodo.value)) {
      return res.status(406).send("Invalid task to do");
    }
    if (!groups.includes(req.body.taskdoing.value)) {
      return res.status(406).send("Invalid task doing");
    }
    if (!groups.includes(req.body.taskdone.value)) {
      return res.status(406).send("Invalid task done");
    }
  } catch (error) {
    res.status(500).send("server error, try again later");
  }

  next();
};

export const validateCreatePlan = async (req, res, next) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(req.body.mvpname)) {
    return res.status(406).send("Invalid plan MVP name");
  }
  try {
    const [[{ count }]] = await db.execute("select count(*) as count from plan where plan_app_acronym = ? and plan_mvp_name = ?", [req.body.app_acronym, req.body.mvpname]);
    if (count > 0) {
      return res.status(406).send("mvp name already taken");
    }
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }

  const dateregex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!dateregex.test(req.body.startdate)) {
    return res.status(406).send("Invalid start date");
  }
  if (!dateregex.test(req.body.enddate)) {
    return res.status(406).send("Invalid end date");
  }

  const colourregex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!colourregex.test(req.body.colour)) {
    return res.status(406).send("Invalid colour");
  }

  next();
};

export const validateExistingApp = async (req, res, next) => {
  try {
    const [apparray] = await db.execute({ sql: `select distinct app_acronym from application`, rowsAsArray: true });
    const apps = apparray.flat();
    if (!apps.includes(req.body.app_acronym)) {
      return res.status(406).send("Invalid App Acronym");
    }
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }
  next();
};

export const validateExistingPlan = async (req, res, next) => {
  if (!req.body.plan) {
    req.body.plan = { value: "", label: "" };
  }
  try {
    const [planarray] = await db.execute({ sql: `select distinct plan_mvp_name from plan where plan_app_acronym = ?`, rowsAsArray: true }, [req.body.app_acronym]);
    const plans = planarray.flat();
    if (req.body.plan.value && !plans.includes(req.body.plan.value)) {
      return res.status(406).send("Invalid plan");
    }
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }
  next();
};

export const validateTaskName = (req, res, next) => {
  const nameregex = /^[a-zA-Z0-9_]+$/;
  if (!nameregex.test(req.body.name)) {
    return res.status(406).send("Invalid acronym");
  }
  next();
};

export const stampTaskNotes = async (req, res, next) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  let notes = "";
  let state = "open";
  try {
    if (req.body.id) {
      const [[task]] = await db.execute("select task_notes, task_state from task where task_id =?", [req.body.id]);
      notes = task.task_notes;
      state = task.task_state;
    }

    req.body.notes = req.body.notes ? `[${req.username}, ${state}, ${timestamp}(UTC)]\n\n${req.body.notes}\n\n*************\n${notes}\n\n` : notes;
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error, try again later");
  }
  next();
};

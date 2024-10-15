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

export const validateApp = async (req, res, next) => {
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
  //permissions
  if (!req.body.taskcreate.value) {
    return res.status(406).send("Invalid task create");
  }
  if (!req.body.taskopen.value) {
    return res.status(406).send("Invalid task open");
  }
  if (!req.body.tasktodo.value) {
    return res.status(406).send("Invalid task to do");
  }
  if (!req.body.taskdoing.value) {
    return res.status(406).send("Invalid task doing");
  }
  if (!req.body.taskdone.value) {
    return res.status(406).send("Invalid task done");
  }
  next();
};

export const validatePlan = async (req, res, next) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(req.body.mvpname)) {
    return res.status(406).send("Invalid plan MVP name");
  }

  try {
    const [[{ count }]] = await db.execute("select count(*) as count from plan where plan_app_acronym = ? and plan_mvp_name = ?", [req.body.acronym, req.body.mvpname]);

    if (count > 0) {
      return res.status(406).send("mvp name already taken");
    }
  } catch (error) {
    console.log(error);
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

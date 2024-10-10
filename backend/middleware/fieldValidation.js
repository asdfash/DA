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


export const validateApp = (req, res, next) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(req.body.acronym)) {
    return res.status(406).send("Invalid app acronym");
  }
  next();
};

export const validatePlan = (req, res, next) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  if (!regex.test(req.body.name)) {
    return res.status(406).send("Invalid plan MVP name");
  }
  next();
};


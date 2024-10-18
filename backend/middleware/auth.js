import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../mysql.js";

export const Login = async (req, res, next) => {
  const [[login]] = await db.execute("SELECT * from `accounts` WHERE `username` = ?", [req.body.username]);
  if (login && bcrypt.compareSync(req.body.password, login.password) && login.isActive) {
    res.cookie(
      "token",
      jwt.sign(
        {
          username: req.body.username,
          ip: req.ip,
          browser: req.headers["user-agent"],
        },
        process.env.TOKENSECRET,
        { expiresIn: process.env.TOKENHOURS * 60 * 60 }
      ),

      { maxAge: process.env.TOKENHOURS * 60 * 60 * 1000, httpOnly: true, secure: process.env.ENV === "Production", sameSite: "Strict" }
    );
    next();
  } else {
    return res.status(401).send("error logging in");
  }
};

export const encrpytPassword = (req, res, next) => {
  if (!req.skipPassword) {
    req.body.password = bcrypt.hashSync(req.body.password);
  }
  next();
};

export const CheckLogin = async (req, res, next) => {
  try {
    const token = jwt.verify(req.cookies.token, process.env.TOKENSECRET);
    req.username = token.username;
    const [[{ count }]] = await db.execute("select count(*) as count from accounts where username = ? and isActive = 1", [req.username]);
    if (count < 1 || token.ip != req.ip || token.browser != req.headers["user-agent"]) {
      throw "err";
    }
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).send("error validating user is logged in");
  }
  next();
};

export const CheckGroup = group => async (req, res, next) => {
  const groupName = group || req.body.group;
  if (!groupName) {
    return res.status(403).send("user not permitted, check with admin");
  }
  try {
    const [[{ count }]] = await db.execute("select count(*) as count from user_groups where username = ? and groupname = ?", [req.username, groupName]);
    return count > 0 ? next() : res.status(403).send("user not permitted, check with admin");
  } catch (error) {
    return res.status(500).send("server error, try again later");
  }
};

export const CheckStatePermission = async (req, res, next) => {
  let state = "create";
  let app_acronym = req.body.app_acronym;
  if (req.body.id) {
    try {
      const [[{ task_state, task_app_acronym }]] = await db.execute("select task_state, task_app_acronym from task where task_id =?", [req.body.id]);
      state = task_state;
      app_acronym = task_app_acronym;
    } catch (error) {
      return res.status(500).send("server error, try again later");
    }
  }
  const [[{ app_permit_create: create, app_permit_open: open, app_permit_todolist: todo, app_permit_doing: doing, app_permit_done: done }]] = await db.execute("select app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from application where app_acronym =?", [app_acronym]);
  const permissions = { create, open, todo, doing, done };
  CheckGroup(permissions[state]);
};

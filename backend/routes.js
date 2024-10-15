import express from "express";
import { AddAppController, AddGroupController, AddPlanController, addUserController, CheckPermissionController, editEmailController, editPasswordController, editUserController, logoutController, ViewAppsController, viewGroupsController, ViewPlansController, viewProfileController, viewUsersController } from "./controllers.js";
import { CheckGroup, CheckLogin, encrpytPassword, Login } from "./middleware/auth.js";
import { validateEmail, validateGroupname, validatePassword, validateUsername, validateAdmin, validateSkipPassword, validateApp, validatePlan } from "./middleware/fieldValidation.js";

//unprotected routes
const route = express.Router();
route.post("/login", Login, (req, res) => res.send("Logged in"));
route.get("/verify", CheckLogin, (req, res) => res.send("logged in"));

//user
route.use(CheckLogin);
route.get("/logout", logoutController);
route.get("/viewProfile", viewProfileController);
route.put("/editEmail", validateEmail, editEmailController);
route.put("/editPassword", validatePassword, encrpytPassword, editPasswordController);
route.get("/viewGroups", viewGroupsController);
route.post("/checkgroup", async (req, res) => {
  const isGroup = await CheckGroup(req.username, req.body.group);
  if (isGroup === "err") {
    res.status(500).send("server error, try again later");
  } else if (isGroup) {
    res.send("ok");
  } else {
    res.status(403).send("user not permitted, check with admin");
  }
});
route.post("/checkpermission", CheckPermissionController);
route.get("/viewapps", ViewAppsController);
route.post(
  "/addapp",
  async (req, res, next) => {
    const isGroup = await CheckGroup(req.username, "pl");
    if (isGroup === "err") {
      res.status(500).send("server error, try again later");
    } else if (isGroup) {
      next();
    } else {
      return res.status(403).send("user not permitted, check with admin");
    }
  },
  validateApp,
  AddAppController
);
route.post("/viewplans", ViewPlansController);
route.post(
  "/addplan",
  async (req, res, next) => {
    const isGroup = await CheckGroup(req.username, "pm");
    if (isGroup === "err") {
      res.status(500).send("server error, try again later");
    } else if (isGroup) {
      next();
    } else {
      return res.status(403).send("user not permitted, check with admin");
    }
  },
  validatePlan,
  AddPlanController
);

//admin
route.use(async (req, res, next) => {
  const isGroup = await CheckGroup(req.username, "admin");
  if (isGroup === "err") {
    res.status(500).send("server error, try again later");
  } else if (isGroup) {
    next();
  } else {
    return res.status(403).send("user not permitted, check with admin");
  }
});
route.get("/viewUsers", viewUsersController);
route.post("/addGroup", validateGroupname, AddGroupController);
route.post("/addUser", validateUsername, validatePassword, encrpytPassword, validateEmail, addUserController);
route.put("/editUser", validateSkipPassword, validatePassword, encrpytPassword, validateEmail, validateAdmin, editUserController);

route.use((req, res) => res.status(404).send("not found"));

export default route;

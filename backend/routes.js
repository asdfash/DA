import express from "express";
import { AddGroupController, addUserController, viewGroupsController, editEmailController, editPasswordController, editUserController, logoutController, viewProfileController, viewUsersController } from "./controllers/usermanagement.js";
import { AddAppController, AddPlanController, addTaskController, CheckPermissionController, ViewAppsController, viewPlanListController, ViewPlansController, ViewTaskController, ViewTasksController } from "./controllers/taskmanagement.js";
import { CheckGroup, CheckLogin, encrpytPassword, Login } from "./middleware/auth.js";
import { validateEmail, validateGroupname, validatePassword, validateUsername, validateAdmin, validateSkipPassword, validateApp, validatePlan, validateTaskName, validateExistingApp, validateExistingPlan } from "./middleware/fieldValidation.js";

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
route.post("/viewplans", ViewPlansController);
route.post("/viewtasks", ViewTasksController);
route.post("/viewtask", ViewTaskController);
route.post("/viewplanlist", viewPlanListController);
route.post("/addtask", validateTaskName,validateExistingApp,validateExistingPlan, addTaskController);
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
  validateExistingApp,
  AddPlanController
);
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

//404
route.use((req, res) => res.status(404).send("not found"));

export default route;

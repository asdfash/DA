import express from "express";
import { AddGroupController, addUserController, viewGroupsController, editEmailController, editPasswordController, editUserController, logoutController, viewProfileController, viewUsersController } from "./controllers/usermanagement.js";
import { AddAppController, AddPlanController, addTaskController, demoteTaskController, editTaskController, promoteTaskController, ViewAppsController, viewPlanListController, ViewPlansController, ViewTaskController, ViewTasksController } from "./controllers/taskmanagement.js";
import { CheckCreatePermission, CheckGroup, CheckLogin, CheckTaskStatePermission, encrpytPassword, Login } from "./middleware/auth.js";
import { validateEmail, validateGroupname, validatePassword, validateUsername, validateAdmin, validateSkipPassword, validateCreateApp, validateCreatePlan, validateTaskName, validateExistingApp, validateExistingPlan, stampTaskNotes } from "./middleware/fields.js";

//unprotected routes
const route = express.Router();
route.post("/login", Login, (req, res) => res.send("Logged in"));
route.get("/verify", CheckLogin, (req, res) => res.send("logged in"));

//user
route.use(CheckLogin);
route.get("/logout", logoutController);
route.get("/viewProfile", viewProfileController);
route.patch("/editEmail", validateEmail, editEmailController);
route.patch("/editPassword", validatePassword, encrpytPassword, editPasswordController);
route.get("/viewGroups", viewGroupsController);
route.post("/checkgroup", CheckGroup(), (req, res) => res.send("ok"));
route.post("/checktaskpermission", validateExistingApp, CheckTaskStatePermission, (req, res) => res.send("ok"));
route.post("/checkcreatetaskpermission", validateExistingApp, CheckCreatePermission, (req, res) => res.send("ok"));
route.post("/viewtask", ViewTaskController);
route.post("/viewtasks", ViewTasksController);
route.post("/viewplans", ViewPlansController);
route.post("/viewplanlist", viewPlanListController);
route.get("/viewapps", ViewAppsController);
route.post("/addtask", validateTaskName, validateExistingApp, validateExistingPlan, CheckCreatePermission, stampTaskNotes, addTaskController);
route.post("/addplan", CheckGroup("pm"), validateCreatePlan, validateExistingApp, AddPlanController);

route.post("/addapp", CheckGroup("pl"), validateCreateApp, AddAppController);

route.post("/promotetask", CheckTaskStatePermission, validateExistingPlan, stampTaskNotes, promoteTaskController);
route.post("/demotetask", CheckTaskStatePermission, validateExistingPlan, stampTaskNotes, demoteTaskController);
route.post("/edittask", CheckTaskStatePermission, validateExistingPlan, stampTaskNotes, editTaskController);

//admin
route.use(CheckGroup("admin"));
route.get("/viewUsers", viewUsersController);
route.post("/addGroup", validateGroupname, AddGroupController);
route.post("/addUser", validateUsername, validatePassword, encrpytPassword, validateEmail, addUserController);
route.patch("/editUser", validateSkipPassword, validatePassword, encrpytPassword, validateEmail, validateAdmin, editUserController);

//404
route.use((req, res) => res.status(404).send("not found"));

export default route;

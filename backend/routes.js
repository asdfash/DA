import express from "express";
import { AddGroupController, addUserController, viewGroupsController, editEmailController, editPasswordController, editUserController, logoutController, viewProfileController, viewUsersController } from "./controllers/usermanagement.js";
import { AddAppController, AddPlanController, addTaskController, demoteTaskController, EditAppController, editTaskController, promoteTaskController, ViewAppsController, viewPlanListController, ViewPlansController, ViewTaskController, ViewTasksController } from "./controllers/taskmanagement.js";
import { CheckCreatePermission, CheckGroup, CheckLogin, CheckTaskStatePermission, encrpytPassword, Login } from "./middleware/auth.js";
import { validateEmail, validateGroupname, validatePassword, validateUsername, validateAdmin, validateSkipPassword, validateCreateAppFields, validateCreatePlan, validateTaskName, validateExistingApp, validateExistingPlan, stampTaskNotes, validateEditableAppFields } from "./middleware/fields.js";
import { createTaskController,getTaskByStateController,promoteTask2DoneController } from "./controllers/api.js";
//unprotected routes
const route = express.Router();
route.post("/login", Login, (req, res) => res.send("Logged in"));
route.get("/verify", CheckLogin, (req, res) => res.send("logged in"));

// assignemnt 3
route.post("/createtask",createTaskController)
route.post("/gettaskbystate",getTaskByStateController)
route.patch("/promotetask2done",promoteTask2DoneController)
route.use((req,res)=>{
    res.json({code:"A001"})
})

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
route.post("/viewtasks", validateExistingApp, ViewTasksController);
route.post("/viewplans", validateExistingApp, ViewPlansController);
route.post("/viewplanlist", viewPlanListController);
route.get("/viewapps", ViewAppsController);
route.post("/addtask", validateExistingApp, validateExistingPlan, validateTaskName, CheckCreatePermission, stampTaskNotes, addTaskController);
route.post("/addplan", CheckGroup("pm"), validateExistingApp, validateCreatePlan, AddPlanController);
route.post("/addapp", CheckGroup("pl"), validateCreateAppFields, validateEditableAppFields, AddAppController);
route.post("/editapp", CheckGroup("pl"), validateExistingApp, validateEditableAppFields, EditAppController);
route.post("/promotetask", CheckTaskStatePermission, validateExistingPlan, stampTaskNotes, promoteTaskController);
route.post("/demotetask", CheckTaskStatePermission, validateExistingPlan, stampTaskNotes, demoteTaskController);
route.post("/edittask", CheckTaskStatePermission, validateExistingPlan, stampTaskNotes, editTaskController);

//admin
route.use(CheckGroup("admin"));
route.get("/viewUsers", viewUsersController);
route.post("/addGroup", validateGroupname, AddGroupController);
route.post("/addUser", validateUsername, validatePassword, encrpytPassword, validateEmail, addUserController);
route.patch("/editUser", validateSkipPassword, validatePassword, encrpytPassword, validateEmail, validateAdmin, editUserController);

export default route;



import express from "express";
import { AddGroupsController, addUserController, editEmailController, editPasswordController, editUserController, logoutController, viewGroupsController, viewProfileController, viewUsersController } from "./controllers.js";
import { CheckGroup, CheckLogin, encrpytPassword, Login } from "./middleware/auth.js";
import { validateEmail, validateGroupname, validatePassword, validateUsername, validateAdmin, validateSkipPassword } from "./middleware/fieldValidation.js";

//unprotected routes
const route = express.Router();
route.post("/login", Login, (req, res) => res.send("Logged in"));
route.get("/verify", CheckLogin, (req, res) => res.send("logged in"));

//user
const userRoute = express.Router();
route.use(CheckLogin);
route.get("/logout", logoutController);
route.get("/viewProfile", viewProfileController);
route.put("/editEmail", validateEmail, editEmailController);
route.put("/editPassword", validatePassword, encrpytPassword, editPasswordController);
route.post("/checkgroup", async (req, res) => {
  if (await CheckGroup(req.username, req.body.group)) {
    res.send("ok");
  } else {
    res.status(403).send("user not permitted, check with admin");
  }
});

//admin
const adminRoute = express.Router();
// adminRoute.use(CheckLogin);
route.use(async (req, res, next) => {
  if (await CheckGroup(req.username, "admin")) {
    next();
  } else {
    return res.status(403).send("user not permitted, check with admin");
  }
});
route.get("/viewUsers", viewUsersController);
route.get("/viewGroups", viewGroupsController);
route.post("/addGroup", validateGroupname, AddGroupsController);
route.post("/addUser", validateUsername, validatePassword, encrpytPassword, validateEmail, addUserController);
route.put("/editUser", validateSkipPassword, validatePassword, encrpytPassword, validateEmail, validateAdmin, editUserController);

route.use((req, res) => res.status(404).send("not found"));

export { route, userRoute, adminRoute };

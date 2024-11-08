import express from "express";
import { createTaskController, getTaskByStateController, promoteTask2DoneController } from "./controllers/api.js";
//unprotected routes
const route = express.Router();

// assignemnt 3
route.post("/createtask", createTaskController);
route.post("/gettaskbystate", getTaskByStateController);
route.patch("/promotetask2done", promoteTask2DoneController);
route.use((req, res) => res.json({ code: "A001" }));

export default route;

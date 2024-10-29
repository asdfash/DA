import db from "../utils/mysql.js";
import transporter from "../utils/mail.js";
import bcrypt from "bcryptjs";

/**
 * create task:
 *  - validate url
 *  - validate body structure
 *  - validate username
 *  - validate password
 *  - validate user group
 *  - validate task app acronym
 *  - validate task name
 *  - validate task description
 *  - validate task note
 *  - validate task plan
 *  - create task
 *  -- increment app rnumber
 *  -- rollback if fail
 *  - send {taskid, code}
 *
 * get task by state:
 *  - validate url
 *  - validate body structure
 *  - validate username
 *  - validate password
 *  - validate app acronym
 *  - validate task state
 *  - get task
 *  - send {array of tasks,code}
 *
 *  * promote task 2 done:
 *  - validate url
 *  - validate body structure
 *  - validate username
 *  - validate password
 *  - validate user group
 *  - validate taskid
 *  - validate task notes
 *  - promote task
 *  - send email
 *  - send {code}
 */
export const getTaskByStateController = async (req, res) => {
  const codes = {
    urlextra: "A001",
    bodytype: "B001",
    bodyparam: "B002",
    credential: "C001",
    wrongvalue: "D001",
    internalerror: "E004",
    success: "S000",
  };

  const url = "/gettaskbystate";
  const objType = "application/json";
  const mandatorykeys = ["username", "password", "task_app_acronym", "task_state"];
  const states = ["open", "todo", "doing", "done", "closed"];
  const maxlength = {
    username: 50,
    password: 50,
    task_app_acronym: 50,
    task_state: 10,
  };

  //URL
  if (req.url.toLowerCase() !== url) {
    return res.json({
      code: codes.urlextra,
    });
  }

  //body
  if (req.headers["content-type"] !== objType) {
    return res.json({
      code: codes.bodytype,
    });
  }

  const keys = Object.keys(req.body);
  for (const key of mandatorykeys) {
    if (!keys.includes(key)) {
      return res.json({
        code: codes.bodyparam,
      });
    }
  }

  try {
    //iam

    if (typeof req.body.username != "string" || typeof req.body.password != "string") {
      return res.json({
        code: codes.credential,
      });
    }

    const [[login]] = await db.execute("SELECT * from `accounts` WHERE `username` = ?", [req.body.username || ""]);
    if (!login || !bcrypt.compareSync(req.body.password, login.password) || !login.isActive) {
      return res.json({
        code: codes.credential,
      });
    }

    //transaction
    if (!req.body.task_app_acronym || typeof req.body.task_app_acronym != "string" || req.body.task_app_acronym.length > maxlength.task_app_acronym) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    const [apparray] = await db.execute({ sql: `select distinct app_acronym from application`, rowsAsArray: true });
    if (!apparray.flat().includes(req.body.task_app_acronym)) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    if (typeof req.body.task_state != "string" || !states.includes(req.body.task_state.toLowerCase())) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    const [tasksarray] = await db.execute("select * from task where task_app_acronym = ? and task_state = ?", [req.body.task_app_acronym, req.body.task_state]);
    const [planarray] = await db.execute("select plan_mvp_name , plan_colour from plan where plan_app_acronym = ?", [req.body.task_app_acronym]);
    const plans = {};
    planarray.forEach(plan => (plans[plan.plan_mvp_name] = plan.plan_colour));
    const tasks = tasksarray.map(task => ({
      task_id: task.task_id,
      task_name: task.task_name,
      task_owner: task.task_owner,
      task_plan_colour: plans[task.task_plan] || "",
    }));
    return res.json({ tasks, code: codes.success });
  } catch (error) {
    console.log(error);
    return res.json({
      code: codes.internalerror,
    });
  }
};

export const createTaskController = async (req, res) => {
  const codes = {
    urlextra: "A001",
    bodytype: "B001",
    bodyparam: "B002",
    credential: "C001",
    wrongvalue: "D001",
    internalerror: "E004",
    success: "S000",
  };

  const url = "/createtask";
  const objType = "application/json";
  const mandatorykeys = ["username", "password", "task_app_acronym", "task_name"];
  const maxlength = {
    username: 50,
    password: 50,
    task_app_acronym: 50,
    task_name: 50,
    task_description: 255,
    task_plan: 50,
  };

  //URL
  if (req.url.toLowerCase() !== url) {
    return res.json({
      code: codes.urlextra,
    });
  }

  //body
  if (req.headers["content-type"] !== objType) {
    return res.json({
      code: codes.bodytype,
    });
  }

  const keys = Object.keys(req.body);
  for (const key of mandatorykeys) {
    if (!keys.includes(key)) {
        console.log(key)
      return res.json({
        code: codes.bodyparam,
      });
    }
  }

  try {
    //iam
    if (!req.body.username) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    if (typeof req.body.username != "string" || req.body.username.length > maxlength.username) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    if (!req.body.password) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    if (typeof req.body.password != "string" || req.body.password.length > maxlength.password) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    const [[login]] = await db.execute("SELECT * from `accounts` WHERE `username` = ?", [req.body.username || ""]);
    if (!login || !bcrypt.compareSync(req.body.password, login.password) || !login.isActive) {
      return res.json({
        code: codes.credential,
      });
    }

    //transaction
  } catch (error) {
    console.log(error);
    return res.json({ code: codes.internalerror });
  }

  res.json({ code: codes.success });
};

export const promoteTask2DoneController = async (req, res) => {
  res.json({ code: "S000" });
};

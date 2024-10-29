import db from "../utils/mysql.js";
import transporter from "../utils/mail.js";
import bcrypt from "bcryptjs";

/**
 *  * promote task 2 done:
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
    login: "C001",
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
        code: codes.login,
      });
    }

    const [[login]] = await db.execute("SELECT * from `accounts` WHERE `username` = ?", [req.body.username || ""]);
    if (!login || !bcrypt.compareSync(req.body.password, login.password) || !login.isActive) {
      return res.json({
        code: codes.login,
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
    login: "C001",
    group: "C003",
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
      return res.json({
        code: codes.bodyparam,
      });
    }
  }

  try {
    //iam

    if (typeof req.body.username != "string" || typeof req.body.password != "string") {
      return res.json({
        code: codes.login,
      });
    }

    const [[login]] = await db.execute("SELECT * from `accounts` WHERE `username` = ?", [req.body.username || ""]);
    if (!login || !bcrypt.compareSync(req.body.password, login.password) || !login.isActive) {
      return res.json({
        code: codes.login,
      });
    }

    if (!req.body.task_app_acronym || typeof req.body.task_app_acronym != "string" || req.body.task_app_acronym.length > maxlength.task_app_acronym) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    const [[app]] = await db.execute("select app_permit_create from application where app_acronym =?", [req.body.task_app_acronym]);
    if (!app) {
      return res.json({
        code: codes.wrongvalue,
      });
    }
    if (!app.app_permit_create) {
      return res.json({
        code: codes.group,
      });
    }
    const [[{ count }]] = await db.execute("select count(*) as count from user_groups where username = ? and groupname = ?", [req.body.username, app.app_permit_create]);
    if (count <= 0) {
      return res.json({
        code: codes.group,
      });
    }

    //transaction
    const nameregex = /^[a-zA-Z0-9 ]{1,50}$/;
    if (typeof req.body.task_name != "string" || !nameregex.test(req.body.task_name)) {
      return res.json({
        code: codes.wrongvalue,
      });
    }

    if (req.body.task_plan) {
      const [planarray] = await db.execute({ sql: `select distinct plan_mvp_name from plan where plan_app_acronym = ?`, rowsAsArray: true }, [req.body.task_app_acronym]);
      if (typeof req.body.task_plan !== "string" || !planarray.flat().includes(req.body.task_plan)) {
        return res.json({
          code: codes.wrongvalue,
        });
      }
    } else req.body.task_plan = "";

    if (req.body.task_description) {
      if (typeof req.body.task_description != "string" || req.body.task_description.length > maxlength.task_description) {
        return res.json({
          code: codes.wrongvalue,
        });
      }
    } else req.body.task_description = "";
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    let notes = `*************\n\n[${req.body.username}, - , ${timestamp}(UTC)]\n\n task promoted to open state \n\n`;
    if (req.body.task_notes) {
      if (typeof req.body.task_notes != "string") {
        return res.json({
          code: codes.wrongvalue,
        });
      }
      notes = `${notes}*************\n\n[${req.body.username}, - , ${timestamp}(UTC)]\n\n${req.body.task_notes}`;
    }
    const createdate = timestamp.slice(0, 10);

    const [[{ rnumber }]] = await db.execute("select app_rnumber as rnumber from application where app_acronym =?", [req.body.task_app_acronym]);
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      const task_id = `${req.body.task_app_acronym}_${rnumber + 1}`;
      await connection.execute("INSERT INTO `task` (`task_id`, `task_name`, `task_description` , `task_notes`, `task_plan`,task_app_acronym, `task_state`, `task_creator`, `task_owner`,`task_createdate`) VALUES (?,?,?,?,?,?,?,?,?,?); ", [task_id, req.body.task_name, req.body.task_description, notes, req.body.task_plan, req.body.task_app_acronym, "open", req.body.username, req.body.username, createdate]);
      await connection.execute("update application set app_rnumber = ? where app_acronym = ? ", [rnumber + 1, req.body.task_app_acronym]);
      await connection.commit();
      return res.json({ task_id, code: codes.success });
    } catch (error) {
      await connection.rollback();
      console.log(error);
      return res.json({ code: codes.internalerror });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.log(error);
    return res.json({ code: codes.internalerror });
  }
};

export const promoteTask2DoneController = async (req, res) => {
  const codes = {
    urlextra: "A001",
    bodytype: "B001",
    bodyparam: "B002",
    login: "C001",
    group: "C003",
    wrongvalue: "D001",
    internalerror: "E004",
    success: "S000",
  };

  const url = "/promotetask2done";
  const objType = "application/json";
  const mandatorykeys = ["username", "password", "task_id"];
  const maxlength = {
    username: 50,
    password: 50,
    task_id: 100,
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
        code: codes.login,
      });
    }

    const [[login]] = await db.execute("SELECT * from `accounts` WHERE `username` = ?", [req.body.username || ""]);
    if (!login || !bcrypt.compareSync(req.body.password, login.password) || !login.isActive) {
      return res.json({
        code: codes.login,
      });
    }

    if (!req.body.task_id || typeof req.body.task_id != "string" || req.body.task_id.length > maxlength.task_id) {
      return res.json({
        code: codes.wrongvalue,
      });
    }
    const [[task]] = await db.execute("select task_app_acronym,task_notes from task where task_id=? and task_state='doing'", [req.body.task_id]);
    if (!task) {
      return res.json({
        code: codes.wrongvalue,
      });
    }
    const [[app]] = await db.execute("select app_permit_create,app_permit_done from application where app_acronym =?", [task.task_app_acronym]);
    if (!app.app_permit_create) {
      return res.json({
        code: codes.group,
      });
    }
    const [[{ count }]] = await db.execute("select count(*) as count from user_groups where username = ? and groupname = ?", [req.body.username, app.app_permit_create]);
    if (count <= 0) {
      return res.json({
        code: codes.group,
      });
    }

    //transaction
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    if (req.body.task_notes) {
      if (typeof req.body.task_notes != "string") {
        return res.json({
          code: codes.wrongvalue,
        });
      }
      req.body.task_notes = `*************\n\n[${req.body.username}, doing , ${timestamp}(UTC)]\n\n${req.body.task_notes}`;
    } else req.body.task_notes = "";
    const notes = `*************\n\n[${req.body.username}, doing , ${timestamp}(UTC)]\n\n task promoted to done state \n\n${req.body.task_notes}\n\n${task.task_notes}`;
    await db.execute(`UPDATE task SET task_state = 'done', task_notes = ?, task_owner = ? WHERE task_id = ?`, [notes, req.body.username, req.body.task_id]);
    
    const mailer = async group => {
      if (group) {
        try {
          const [userarray] = await db.execute({ sql: "SELECT username FROM user_groups WHERE groupname = ?", rowsAsArray: true }, [group]);
          const [emails] = await db.execute(
            {
              sql: `SELECT DISTINCT email FROM accounts WHERE username IN (${userarray
                .flat()
                .map(() => "?")
                .join(",")})`,
              rowsAsArray: true,
            },
            userarray.flat()
          );

          if (emails.flat().filter(email => email !== "").length) {
            transporter.sendMail({
              from: "tms@tms.com",
              to: emails.flat(),
              subject: "Task sent for approval",
              text: `Hi user,\n\nA task: ${req.body.task_id} has been sent for approval. Please log in to TMS to approve or reject it.\nBest regards,\nTMS team\n\nThis is a computer-generated email. Please do not reply.`,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    mailer(app.app_permit_done);

    return res.json({ code: "S000" });
  } catch (error) {
    console.log(error);
    return res.json({ code: codes.internalerror });
  }
};

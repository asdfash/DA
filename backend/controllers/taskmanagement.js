import db from "../utils/mysql.js";
import transporter from "../utils/mail.js";

//applist
export const ViewAppsController = async (req, res) => {
  try {
    const [apparray] = await db.execute("SELECT * FROM application");

    const apps = apparray.map(app => ({
      acronym: app.app_acronym,
      description: app.app_description,
      rnumber: app.app_rnumber,
      startdate: app.app_startdate,
      enddate: app.app_enddate,
      taskcreate: { value: app.app_permit_create, label: app.app_permit_create },
      taskopen: { value: app.app_permit_open, label: app.app_permit_open },
      tasktodo: { value: app.app_permit_todolist, label: app.app_permit_todolist },
      taskdoing: { value: app.app_permit_doing, label: app.app_permit_doing },
      taskdone: { value: app.app_permit_done, label: app.app_permit_done },
    }));

    res.json(apps);
  } catch (error) {
    res.status(500).send("Server error, please try again later");
  }
};

export const AddAppController = async (req, res) => {
  try {
    await db.execute("INSERT INTO `application` (`app_acronym`, `app_description`, `app_rnumber` , `app_startdate`, `app_enddate`, `app_permit_create`, `app_permit_open`, `app_permit_todolist`,`app_permit_doing`,`app_permit_done`) VALUES (?,?,?,?,?,?,?,?,?,?); ", [req.body.acronym, req.body.description, 0, req.body.startdate, req.body.enddate, req.body.taskcreate.value, req.body.taskopen.value, req.body.tasktodo.value, req.body.taskdoing.value, req.body.taskdone.value]);
    res.send("app created");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

//planlist
export const ViewPlansController = async (req, res) => {
  try {
    const [planarray] = await db.execute("SELECT * FROM plan WHERE plan_app_acronym = ?", [req.body.app_acronym]);

    const plans = planarray.map(plan => ({
      mvpname: plan.plan_mvp_name,
      startdate: plan.plan_startdate,
      enddate: plan.plan_enddate,
      colour: plan.plan_colour,
    }));

    res.json(plans);
  } catch (error) {
    res.status(500).send("Server error, please try again later");
  }
};

export const AddPlanController = async (req, res) => {
  try {
    await db.execute("INSERT INTO `plan` (`plan_mvp_name`,`plan_app_acronym`, `plan_startdate`, `plan_enddate`,`plan_colour`) VALUES (?,?,?,?,?); ", [req.body.mvpname, req.body.app_acronym, req.body.startdate, req.body.enddate, req.body.colour]);
    res.send("plan created");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

//Tasklist
export const ViewTasksController = async (req, res) => {
  try {
    const [tasksarray] = await db.execute("select * from task where task_app_acronym = ?", [req.body.app_acronym]);
    const [planarray] = await db.execute("select plan_mvp_name , plan_colour from plan where plan_app_acronym = ?", [req.body.app_acronym]);
    const plans = {};
    planarray.forEach(plan => (plans[plan.plan_mvp_name] = plan.plan_colour));
    const tasks = {
      open: [],
      todo: [],
      doing: [],
      done: [],
      closed: [],
    };
    tasksarray.forEach(task =>
      tasks[task.task_state].push({
        id: task.task_id,
        name: task.task_name,
        colour: plans[task.task_plan] || "",
        owner: task.task_owner,
      })
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const addTaskController = async (req, res) => {
  try {
    const createdate = new Date().toISOString().slice(0, 10);

    const [[{ rnumber }]] = await db.execute("select app_rnumber as rnumber from application where app_acronym =?", [req.body.app_acronym]);
    const connection = await db.getConnection();
    await connection.beginTransaction();
    try {
      await connection.execute("INSERT INTO `task` (`task_id`, `task_name`, `task_description` , `task_notes`, `task_plan`,task_app_acronym, `task_state`, `task_creator`, `task_owner`,`task_createdate`) VALUES (?,?,?,?,?,?,?,?,?,?); ", [`${req.body.app_acronym}_${rnumber}`, req.body.name, req.body.description, req.body.notes, req.body.plan.value || "", req.body.app_acronym, "open", req.username, req.username, createdate]);
      await connection.execute("update application set app_rnumber = ? where app_acronym = ? ", [rnumber + 1, req.body.app_acronym]);
      await connection.commit();
      return res.send("task created");
    } catch (error) {
      await connection.rollback();
      return res.status(500).send("server error, try again later");
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

//plan popup
export const viewPlanListController = async (req, res) => {
  try {
    const [planarray] = await db.execute({ sql: `select distinct plan_mvp_name from plan where plan_app_acronym = ?`, rowsAsArray: true }, [req.body.app_acronym]);
    const plans = planarray.flat().map(plan => ({ value: plan, label: plan }));
    res.json(plans);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

//Task popup
export const ViewTaskController = async (req, res) => {
  try {
    const [[task]] = await db.execute("select * from task where task_id = ?", [req.body.id]);

    res.json({
      id: task.task_id,
      name: task.task_name,
      description: task.task_description,
      plan: { value: task.task_plan, label: task.task_plan },
      notes: task.task_notes,
      app_acronym: task.task_app_acronym,
      state: task.task_state,
      owner: task.task_owner,
      creator: task.task_creator,
      createdate: task.task_createdate,
    });
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const promoteTaskController = async (req, res) => {
  const states = {
    open: "todo",
    todo: "doing",
    doing: "done",
    done: "closed",
  };

  const mailer = async app_acronym => {
    try {
      const [[{ group }]] = await db.execute("SELECT app_permit_done AS `group` FROM application WHERE app_acronym = ?", [app_acronym]);
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
        await transporter.sendMail({
          from: "tms@tms.com",
          to: emails.flat(),
          subject: "Task sent for approval",
          text: `Hi user,\n\nA task has been sent for approval. Please log in to TMS to approve or reject it.\nBest regards,\nTMS team\n\nThis is a computer-generated email. Please do not reply.`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  try {
    const [[{ task_state: state, task_app_acronym: app_acronym }]] = await db.execute("SELECT task_state, task_app_acronym FROM task WHERE task_id = ?", [req.body.id]);

    const taskStateUpdate = states[state];
    const taskPlan = state === "done" || state === "open" ? `task_plan = ?, ` : "";
    const params = [taskStateUpdate, req.body.notes, req.username, req.body.id];
    taskPlan ? params.unshift(req.body.plan.value) : {};
    await db.execute(`UPDATE task SET ${taskPlan} task_state = ?, task_notes = ?, task_owner = ? WHERE task_id = ?`, params);
    res.send("task promoted");

    if (state === "doing") {
      mailer(app_acronym);
    }
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const demoteTaskController = async (req, res) => {
  const states = {
    doing: "todo",
    done: "doing",
  };
  try {
    const [[{ state }]] = await db.execute("select task_state as state from task where task_id =?", [req.body.id]);
    await db.execute(`update task set task_state = ? , ${state === "done" || state === "open" ? `task_plan = \'${req.body.plan.value}\' , ` : ""} task_notes = ? ,task_owner = ? where task_id = ?`, [states[state], req.body.notes, req.username, req.body.id]);
    res.send("task demoted");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const editTaskController = async (req, res) => {
  try {
    const [[{ state }]] = await db.execute("select task_state as state from task where task_id =?", [req.body.id]);
    await db.execute(`update task set ${state === "done" || state === "open" ? `task_plan = \'${req.body.plan.value}\' , ` : ""} task_notes = ?, task_owner = ? where task_id =  ? `, [req.body.notes, req.username, req.body.id]);
    res.send("task edited");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

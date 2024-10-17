import db from "../mysql.js";
import transporter from "../mail.js";

//applist
export const ViewAppsController = async (req, res) => {
  try {
    const [apparray] = await db.execute("select * from application");
    const apps = [];
    apparray.forEach(app => {
      apps.push({
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
      });
    });
    res.json(apps);
  } catch (error) {
    res.status(500).send("server error, try again later");
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
    const [planarray] = await db.execute("select * from plan where plan_app_acronym = ?", [req.body.acronym]);
    const plans = [];
    planarray.forEach(plan => {
      plans.push({
        mvpname: plan.plan_mvp_name,
        startdate: plan.plan_startdate,
        enddate: plan.plan_enddate,
        colour: plan.plan_colour,
      });
    });
    res.json(plans);
  } catch (error) {
    res.status(500).send("server error, try again later");
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

export const viewPlanListController = async (req, res) => {
  try {
    const [planarray] = await db.execute({ sql: `select distinct plan_mvp_name from plan where plan_app_acronym = ?`, rowsAsArray: true }, [req.body.app_acronym]);
    const plans = planarray.flat().map(plan => ({ value: plan, label: plan }));
    res.json(plans);
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const addTaskController = async (req, res) => {
  try {
    const [[{ rnumber }]] = await db.execute("select app_rnumber as rnumber from application where app_acronym =?", [req.body.app_acronym]);
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const createdate = new Date().toISOString().slice(0, 10);
      await connection.execute("INSERT INTO `task` (`task_id`, `task_name`, `task_description` , `task_notes`, `task_plan`,task_app_acronym, `task_state`, `task_creator`, `task_owner`,`task_createdate`) VALUES (?,?,?,?,?,?,?,?,?,?); ", [req.body.app_acronym.concat("_", rnumber), req.body.name, req.body.description, req.body.notes, req.body.plan.value || "", req.body.app_acronym, "open", req.username, req.username, createdate]);
      await connection.execute("update application set app_rnumber = ? where app_acronym = ? ", [rnumber + 1, req.body.app_acronym]);
      await connection.commit();
      return res.send("task created");
    } catch (error) {
      await connection.rollback();
      return res.status(500).send("server error, try again later");
    } finally {
      return connection.release();
    }
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
      const [[{ group }]] = await db.execute("select app_permit_done as `group` from application where app_acronym = ?", [app_acronym]);
      const [userarray] = await db.execute({ sql: `select username from user_groups where groupname = ?`, rowsAsArray: true }, [group]);
      const [emailarray] = await db.execute({ sql: `select distinct email from accounts where username in ('${userarray.flat().join(`','`)}')`, rowsAsArray: true });
      const emails = emailarray.flat();
      if (emails.length > 0) {
        transporter.sendMail({
          to: emails,
          subject: "A task has been sent for approval",
          text: "Hi user, \n\n a task has been sent for approval. Please log in to the TMS to approve or reject it. \n Best regards, \n TMS team \n \n This is a computer generated email, please do not reply to it.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  try {
    const [[{ task_state: state, task_app_acronym: app_acronym }]] = await db.execute("select task_state,task_app_acronym from task where task_id =?", [req.body.id]);
    await db.execute("update task set task_state = ? where task_id = ?", [states[state], req.body.id]);
    res.send("task promoted");
    if (state === "doing") {
      mailer(app_acronym);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error, try again later");
  }
};

export const demoteTaskController = async (req, res) => {
  const states = {
    doing: "todo",
    done: "doing",
  };
  try {
    const [[{ state }]] = await db.execute("select task_state as state from task where task_id =?", [req.body.id]);
    await db.execute("update task set task_state = ? where task_id = ?", [states[state], req.body.id]);
    res.send("task demoted");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

export const editTaskController = async (req, res) => {
  // refer to validate notes middleware for stamp

  try {
    const [[{ state }]] = await db.execute("select task_state as state from task where task_id =?", [req.body.id]);
    await db.execute(`update task set ${state === "done" || state === "open" ? `task_plan = \'${req.body.plan.value}\' , ` : ""} task_notes = ?, task_owner = ? where task_id =  ? `, [req.body.notes, req.username, req.body.id]);
    res.send("task edited");
  } catch (error) {
    res.status(500).send("server error, try again later");
  }
};

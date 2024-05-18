const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const router = express.Router();

router.post("/comite", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.queryCst(`
    SELECT
        users.userid,
        userfirstname,
        userlastname,
        useremail,
        userphone,
        useraffiliation,
        to_char(users.useradddate, 'DD-MM-YYYY HH24:MI:SS') AS useradddate, 
        STRING_AGG(userrole, ', ') AS userrole
    FROM userRoles 
    INNER JOIN users on users.userid = userRoles.userid
    WHERE userRoles.confid = ${req.body.confid}
    GROUP BY users.userid, userfirstname, userlastname, useremail, userphone, useraffiliation`);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "endpoint", "comite");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/removePCMember", auth.ensureAuthenticated, async (req, res) => {
  try {
    await db.queryCst(`
      DELETE FROM userRoles
      WHERE
          confid = ${req.body.confid}
      AND userid = ${req.body.userid}`);

    const user = await db.queryCst(
      `SELECT CONCAT(userfirstname, ' ',userlastname) as user FROM users WHERE userid = ${req.body.userid}`
    );

    db.createEvent(
      req.body.confid,
      req.body.responsibleUser,
      `A ${user[0].user} has been removed`
    );

    return res.status(200).send({ msg: "" });
  } catch (error) {
    log.addLog(error, "endpoint", "removePCMember");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/updateRoleMember", auth.ensureAuthenticated, async (req, res) => {
  try {
    await db.queryCst(`
      UPDATE userRoles SET
        userrole = '${req.body.role}'
      WHERE
        confid = ${req.body.confid}
      AND userid = ${req.body.userid}`);

    const user = await db.queryCst(
      `SELECT CONCAT(userfirstname, ' ',userlastname) as user FROM users WHERE userid = ${req.body.userid}`
    );

    await db.createEvent(
      req.body.confid,
      req.body.responsibleUser,
      `A change has been made to the role of ${user[0].user}`
    );

    return res.status(200).send({ msg: "" });
  } catch (error) {
    log.addLog(error, "endpoint", "updateRoleMember");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

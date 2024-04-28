const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/comite", auth.ensureAuthenticated, async (req, res) => {
  try {
    const queryText = `
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
        GROUP BY users.userid, userfirstname, userlastname, useremail, userphone, useraffiliation`;

    const result = await db.fetchDataCst(queryText);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/removePCMember", auth.ensureAuthenticated, async (req, res) => {
  try {
    const queryText = `
        DELETE FROM userRoles
        WHERE
            confid = ${req.body.confid}
        AND userid = ${req.body.userid}`;

    await db.fetchDataCst(queryText);
    return res.status(200).send({ msg: "" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/updateRoleMember", auth.ensureAuthenticated, async (req, res) => {
  try {
    const queryText = `
      UPDATE userRoles SET
        userrole = '${req.body.role}'
      WHERE
        confid = ${req.body.confid}
      AND userid = ${req.body.userid}`;

    await db.fetchDataCst(queryText);
    return res.status(200).send({ msg: "" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

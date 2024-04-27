const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/comite", auth.ensureAuthenticated, async (req, res) => {
  try {
    const queryText = `
        SELECT
            userroleid AS id,
            userfirstname,
            userlastname,
            useremail,
            userphone,
            useraffiliation,
            STRING_AGG(userrole, ', ') AS userrole
        FROM userRoles 
        INNER JOIN users on users.userid = userRoles.userid
        WHERE userRoles.confid = ${req.body.confid}
        GROUP BY userfirstname, userlastname, useremail, userphone, useraffiliation`;

    const result = await db.fetchDataCst(queryText);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/removePCMember", auth.ensureAuthenticated, async (req, res) => {
  try {
    const queryText = `
        DELETE userRoles 
        WHERE 
            userRoles.confid = ${req.body.confid} 
        AND userid = ${req.body.userid}`;

    const result = await db.fetchDataCst(queryText);
    return res.status(200);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

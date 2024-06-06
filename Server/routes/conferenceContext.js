const express = require("express");
const router = express.Router();
const db = require("../utility/database");
const auth = require("../utility/verifications");

router.post("/confContext", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT 
        userRoles.confid AS usercurrentconfid,
        STRING_AGG(userrole, ',') AS userrole,
         CASE 
            WHEN NOW() < confstartsubmission THEN 'Configuration'
            WHEN confstartsubmission <= NOW() AND confendsubmission >= NOW() THEN 'Submission'
            WHEN confstartreview <= NOW() AND confendreview >= NOW() THEN 'Review'
            WHEN confstartbidding <= NOW() AND confendbidding >= NOW() THEN 'Bidding'
            WHEN NOW() > confendreview THEN 'Pre-Conference'
          END AS confphase
      FROM users
      INNER JOIN conferences ON conferences.confid = users.usercurrentconfid
      INNER JOIN userRoles ON userRoles.confid = conferences.confid AND userRoles.userid = users.userid 
      WHERE users.userid = ${req.body.userid}
      GROUP BY 
        userRoles.confid, confName, conferences.confid;`;

    const result = await db.fetchDataCst(query);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post(
  "/updateConfContext",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const queryText = `
      UPDATE users SET
        usercurrentconfid = ${req.body.confid}
      WHERE
        userid = ${req.body.userid}`;

      await db.fetchDataCst(queryText);
      return res.status(200).send({ msg: "" });
    } catch (error) {
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

module.exports = router;

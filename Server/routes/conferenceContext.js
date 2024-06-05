const express = require("express");
const router = express.Router();
const db = require("../utility/database");
const auth = require("../utility/verifications");

router.post("/confContext", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
    SELECT 
    userRoles.confid AS "id",
    confName,
    conferences.confid,
    STRING_AGG(userrole, ',') AS userrole,
     CASE 
        WHEN NOW() < confstartsubmission THEN 'Configuration'
        WHEN confstartsubmission <= NOW() AND confendsubmission >= NOW() THEN 'Submission'
        WHEN confstartreview <= NOW() AND confendreview >= NOW() THEN 'Review'
        WHEN confstartbidding <= NOW() AND confendbidding >= NOW() THEN 'Bidding'
        WHEN NOW() > confendreview THEN 'Pre-Conference'
      END AS status
  FROM conferences
  INNER JOIN userRoles ON userRoles.confid = conferences.confid
  WHERE userRoles.userid = ${req.body.userid} AND confenddate >= NOW()
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

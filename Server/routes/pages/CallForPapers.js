const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

const router = express.Router();

router.post("/callForPapers", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
      SELECT 
        conf.confid AS confid,
        confname AS confname,
        confcountry AS confcountry,
        to_char(confendsubmission, 'DD-MM-YYYY') AS confsubmissionend,
        to_char(confstartdate, 'DD-MM-YYYY') AS confstartdate,
        confareaname AS conftopics,
        COALESCE(STRING_AGG(userrole, ','), 'Author') AS userrole,
        CASE 
          WHEN NOW() < confstartsubmission THEN 'Configuration'
          WHEN confstartsubmission <= NOW() AND confendsubmission >= NOW() THEN 'Submission'
          WHEN confstartreview <= NOW() AND confendreview >= NOW() THEN 'Review'
          WHEN confstartbidding <= NOW() AND confendbidding >= NOW() THEN 'Bidding'
          WHEN NOW() > confendreview THEN 'Pre-Conference'
        END AS confphase
      FROM conferences conf
      INNER JOIN confAreas area ON area.confareaid = conf.confareaid
      LEFT  JOIN userRoles ON userRoles.confid = conf.confid AND userRoles.userid = ${req.body.userid}
      WHERE
        confapproved = 2
      AND confstartsubmission <= NOW() AND confendsubmission >= NOW() AND confenddate >= NOW()
      GROUP BY
        conf.confid, confname, confcountry, confendsubmission, confstartdate, confareaname
      `);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "endpoint", "allEvents");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

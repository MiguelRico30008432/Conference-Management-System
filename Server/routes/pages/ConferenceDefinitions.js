const express = require("express");
const log = require("../../logs/logsManagement");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/confDefinitions", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT 
        confname,
        confwebpage,
        confcity,
        confcountry,
        confcontact,
        confstartsubmission,
        confendsubmission,
        confstartbidding,
        confendbidding,
        confstartreview,
        confendreview,
        confstartdate,
        confenddate,
        confminreviewers,
        confmaxreviewers,
        confsubupdate
      FROM conferences
      WHERE conferences.confid = ${req.body.confid}`;

    const result = await db.fetchDataCst(query);
    return res.status(200).send(result);
  } catch (error) {
    log.addLog(err, "database", "ConferenceDefinitions -> /confDefinitions");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

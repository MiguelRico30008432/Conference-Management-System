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

router.post("/saveConfDefinitions", auth.ensureAuthenticated, async (req, res) => {
  try {
    await db.updateData(
      "conferences",
      {
        confname: req.body.confname,
        confwebpage: req.body.confwebpage,
        confcity: req.body.confcity,
        confcountry: req.body.confcountry,
        confcontact: req.body.confcontact,
        confstartsubmission: req.body.confstartsubmission,
        confendsubmission: req.body.confendsubmission,
        confstartbidding: req.body.confstartbidding,
        confendbidding: req.body.confendbidding,
        confstartreview: req.body.confstartreview,
        confendreview: req.body.confendreview,
        confstartdate: req.body.confstartdate,
        confenddate: req.body.confenddate,
        confminreviewers: req.body.confminreviewers,
        confmaxreviewers: req.body.confmaxreviewers,
        confsubupdate: req.body.confsubupdate,
      },
      { confid: req.body.confid }
    );
    return res.status(200).send({ msg: "" });
  } catch (error) {
    log.addLog(err, "database", "ConferenceDefinitions -> /saveConfDefinitions");
    return res.status(500).send({ msg: "Internal Error" });
  }
});
module.exports = router;

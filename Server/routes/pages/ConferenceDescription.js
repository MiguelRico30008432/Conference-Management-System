const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post(
  "/conferenceDescription",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const confData = await db.fetchDataCst(
        `SELECT
            c.confname,
            c.confcity,
            c.confcountry,
            c.confwebpage,
            c.confdescription,
            c.confstartsubmission,
            c.confendsubmission,
            c.confstartreview,
            c.confendreview,
            c.confstartbidding,
            c.confendbidding,
            c.confstartdate,
            c.confenddate,
            c.confmaxreviewers,
            c.confminreviewers,
            c.confadddate,
            c.confcontact,
            ct.conftypename AS conftype,
            ca.confareaname AS confareaid,
            CONCAT(u.userfirstname, ' ', u.userlastname) AS confowner
        FROM
            conferences c
        JOIN
            conftypes ct ON c.conftype = ct.conftypeid
        JOIN
            confareas ca ON c.confareaid = ca.confareaid
        JOIN
            users u ON c.confowner = u.userid
        WHERE
            c.confid = ${req.body.confID}`
      );

      return res.status(200).json(confData);
    } catch (error) {
      log.addLog(error, "endpoint", "conferenceDescription");
      res.status(500).send({ msg: "Error fetching submission data" });
    }
  }
);

router.post(
  "/conferanceProgress",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const confProgress = await db.fetchDataCst(`
        SELECT
            CAST((EXTRACT(DAY FROM NOW()-confadddate) * 100) / (EXTRACT(DAY FROM confendDate-confadddate)) AS int) AS percentage
        FROM conferences 
        WHERE
            confid = ${req.body.confid}`);

      const confPhase = await db.fetchDataCst(`  
        SELECT
        CASE 
            WHEN NOW() < confstartsubmission THEN 'Configuration'
            WHEN confstartsubmission <= NOW() AND confendsubmission >= NOW() THEN 'Submission'
            WHEN confstartreview <= NOW() AND confendreview >= NOW() THEN 'Review'
            WHEN confstartbidding <= NOW() AND confendbidding >= NOW() THEN 'Bidding'
            WHEN NOW() > confendreview THEN 'Pre-Conference'
            ELSE NULL 
        END AS status
        FROM conferences
        WHERE conferences.confid = ${req.body.confid} AND confenddate >= NOW()`);

      const progress = {
        percentage: confProgress[0]?.percentage || 0,
        status: confPhase[0]?.status || "",
      };

      return res.status(200).json(progress);
    } catch (error) {
      log.addLog(error, "endpoint", "conferanceProgress");
      res.status(500).send({ msg: "Error fetching submission data" });
    }
  }
);

module.exports = router;

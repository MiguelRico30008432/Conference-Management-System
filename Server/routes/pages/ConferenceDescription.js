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
      const confData = await db.fetchDataCst(`
      SELECT 
        conferences.confid AS "id",
        conferences.confname,
        conferences.confdescription,
        to_char(conferences.confstartdate, 'DD-MM-YYYY') AS confstartdate,
        to_char(conferences.confenddate, 'DD-MM-YYYY') AS confenddate,
        to_char(conferences.confstartsubmission, 'DD-MM-YYYY') AS confstartsubmission,
        to_char(conferences.confendsubmission, 'DD-MM-YYYY') AS confendsubmission,
        to_char(conferences.confstartreview, 'DD-MM-YYYY') AS confstartreview,
        to_char(conferences.confendreview, 'DD-MM-YYYY') AS confendreview,
        to_char(conferences.confstartbidding, 'DD-MM-YYYY') AS confstartbidding,
        to_char(conferences.confendbidding, 'DD-MM-YYYY') AS confendbidding,
        to_char(conferences.confadddate, 'DD-MM-YYYY') AS confadddate,
        STRING_AGG(users.userfirstname || ' ' || users.userlastname, ', ') AS confowner,
        STRING_AGG(conferences.confcountry || ' (' || conferences.confcity || ')', ', ') AS confLocation,
        confareas.confareaname,
        conferences.confwebpage,
        conferences.confapproved,
        conferences.confcontact,
        conftypes.conftypename
      FROM conferences
      INNER JOIN confareas ON confareas.confareaid = conferences.confareaid
      INNER JOIN users ON users.userid = conferences.confowner
      INNER JOIN conftypes ON conftypes.conftypeid = conferences.conftype
      WHERE conferences.confid = ${req.body.confID}
      GROUP BY 
        conferences.confid, 
        conferences.confname, 
        conferences.confdescription, 
        conferences.confstartdate, 
        conferences.confenddate, 
        conferences.confstartsubmission, 
        conferences.confendsubmission, 
        conferences.confstartreview, 
        conferences.confendreview, 
        conferences.confstartbidding, 
        conferences.confendbidding, 
        conferences.confadddate, 
        confareas.confareaname, 
        conferences.confwebpage, 
        conferences.confapproved,
        conferences.confcontact,
        conftypes.conftypename`);
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

      const progress = {
        percentage: confProgress[0]?.percentage || 0,
      };

      return res.status(200).json(progress);
    } catch (error) {
      log.addLog(error, "endpoint", "conferanceProgress");
      res.status(500).send({ msg: "Error fetching submission data" });
    }
  }
);

module.exports = router;

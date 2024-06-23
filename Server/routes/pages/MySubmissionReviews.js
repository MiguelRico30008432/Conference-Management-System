const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post(
  "/MySubmissionReviews",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataCst(`
        SELECT
            submissions.submissionid,
            submissiontitle,
            to_char(submissionadddate, 'DD-MM-YYYY') AS submissionadddate,
            Concat(userfirstname, ' ', userlastname) AS username
        FROM submissions
        INNER JOIN authors ON authors.submissionid = submissions.submissionid
        INNER JOIN users ON authors.userid = users.userid
        INNER JOIN ReviewsAssignments ON assignmentsubmissionid = submissions.submissionid
        WHERE users.userid = ${req.body.userid} AND assignmentconfid = ${req.body.confid}
        `);

      return res.status(200).send(result);
    } catch (error) {
      log.addLog(error, "MySubmissionReviews", "MySubmissionReviews");
      return res.status(500);
    }
  }
);

module.exports = router;

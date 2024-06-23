const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/MySubmissionReviews", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
        SELECT
            submissionid,
            submissiontitle,
            to_char(submissionadddate, 'DD-MM-YYYY') AS submissionadddate,
            Concat(userfirstname, ' ', userlastname) AS username
        FROM ReviewsAssignments
        INNER JOIN submissions ON submissionid = assignmentsubmissionid
        INNER JOIN reviews ON reviewassignmentid = assignmentid
        INNER JOIN users ON submissionmainauthor = userid
        WHERE 
            assignmentconfid = ${req.body.confid}
        GROUP BY
          submissionid, submissiontitle, submissionadddate, userfirstname, userlastname          
        `);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "MySubmissionReviews", "MySubmissionReviews");
    return res.status(500);
  }
});

router.post("/multiReviews", auth.ensureAuthenticated, async (req, res) => {
  try {
    const abstract = await db.fetchDataCst(`
      SELECT
        submissionabstract
      FROM submissions
      WHERE 
        submissionid = ${req.body.submissionid}
      `);

    const lines = await db.fetchDataCst(`
      SELECT
        reviewtext,
        reviewgrade,
        to_char(reviewadddate, 'DD-MM-YYYY') AS reviewadddate,
        Concat(userfirstname, ' ', userlastname) AS username
      FROM reviews
      INNER JOIN ReviewsAssignments ON assignmentid = reviewassignmentid
      INNER JOIN submissions ON submissionid = assignmentsubmissionid
      INNER JOIN users ON assignmentuserid = users.userid
      WHERE 
          assignmentsubmissionid = ${req.body.submissionid}
      `);

    return res.status(200).send({ abstract: abstract, lines: lines });
  } catch (error) {
    log.addLog(error, "endpoint", "multiReviews");
    return res.status(500);
  }
});

module.exports = router;

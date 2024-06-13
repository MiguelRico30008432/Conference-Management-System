const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/multiReviews", auth.ensureAuthenticated, async (req, res) => {
  try {
    const abstract = await db.fetchDataCst(`
      SELECT
        submissionabstract
      FROM ReviewsAssignments
      INNER JOIN submissions on submissionid = assignmentsubmissionid
      WHERE 
        assignmentid = ${req.body.assignmentid}
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
          reviewassignmentid = ${req.body.assignmentid}
      AND assignmentuserid = ${req.body.userid}
      `);

    return res.status(200).send({ abstract: abstract, lines: lines });
  } catch (error) {
    log.addLog(error, "endpoint", "multiReviews");
    return res.status(500);
  }
});

module.exports = router;

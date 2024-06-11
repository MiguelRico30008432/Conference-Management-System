const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

// Fetch all submissions with their average grades
router.post("/allSubmissionsDecisions", auth.ensureAuthenticated, async (req, res) => {
  const { confid } = req.body;

  try {
    const queryText = `
      SELECT
        submissions.submissionid,
        submissions.submissiontitle,
        STRING_AGG(DISTINCT authors.authorfirstname || ' ' || authors.authorlastname, ', ') AS authors,
        TRIM(TO_CHAR(AVG(reviews.reviewgrade), '999D9'))::float AS averagegrade
      FROM
        submissions
      LEFT JOIN
        reviewsassignments ON submissions.submissionid = reviewsassignments.assignmentsubmissionid
      LEFT JOIN
        reviews ON reviewsassignments.assignmentid = reviews.reviewassignmentid
      LEFT JOIN
        authors ON submissions.submissionid = authors.submissionid
      WHERE
        submissions.submissionconfid = $1 AND submissions.submissionaccepted = false
      GROUP BY
        submissions.submissionid, submissions.submissiontitle
      ORDER BY
        submissions.submissionid;
    `;
    const result = await db.pool.query(queryText, [confid]);

    res.status(200).json(result.rows);
  } catch (err) {
    log.addLog(err, "backend", "allSubmissionsDecisions");
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

// Fetch detailed review information for a specific submission
router.post("/submissionDecisionDetails", auth.ensureAuthenticated, async (req, res) => {
  const { submissionId } = req.body;

  try {
    const queryText = `
      SELECT
        users.userfirstname,
        users.userlastname,
        reviews.reviewgrade,
        reviews.reviewtext
      FROM
        reviews
      LEFT JOIN
        reviewsassignments ON reviews.reviewassignmentid = reviewsassignments.assignmentid
      LEFT JOIN
        users ON reviews.userid = users.userid
      WHERE
        reviewsassignments.assignmentsubmissionid = $1;
    `;
    const result = await db.pool.query(queryText, [submissionId]);

    res.status(200).json(result.rows);
  } catch (err) {
    log.addLog(err, "backend", "submissionDecisionDetails");
    res.status(500).json({ message: "Failed to fetch submission details" });
  }
});

module.exports = router;
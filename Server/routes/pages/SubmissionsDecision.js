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
        s.submissionid,
        s.submissiontitle AS title,
        STRING_AGG(CONCAT(a1.authorfirstname, ' ', a1.authorlastname), ', ') AS authors,
        COALESCE(ROUND(AVG(r.reviewgrade)::numeric, 1), 0) AS averagegrade
      FROM
        submissions s
      LEFT JOIN
        reviewsassignments ra ON s.submissionid = ra.assignmentsubmissionid
      LEFT JOIN
        reviews r ON ra.assignmentid = r.reviewassignmentid
      LEFT JOIN
        authors a1 ON s.submissionid = a1.submissionid
      WHERE
        s.submissionconfid = $1
      GROUP BY
        s.submissionid, s.submissiontitle
      ORDER BY
        s.submissionid;
    `;
    const result = await db.pool.query(queryText, [confid]);

    return res.status(200).json(result.rows);
  } catch (error) {
    log.addLog(error, "database", "SubmissionsDecision -> /allSubmissionsDecisions");
    return res.status(500).send({ message: "Failed to fetch submissions" });
  }
});

module.exports = router;
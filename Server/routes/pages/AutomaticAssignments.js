const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const al = require("../../utility/algorithms");

router.post(
  "/getAutomaticAssignments",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataCst(`
      SELECT
        s.submissiontitle,
        u.userfirstname || ' ' || u.userlastname AS committeeMember,
        CASE 
                WHEN ra.assignmentmanually = false THEN 'No'
                ELSE 'Yes'
        END AS assignmentmanually
      FROM
        reviewsassignments ra
      INNER JOIN submissions s ON s.submissionid = assignmentsubmissionid
      INNER JOIN users u ON u.userid = assignmentuserid
      WHERE
        assignmentconfid = ${req.body.confid} 
      ORDER BY
        s.submissiontitle, u.userfirstname, u.userlastname;
      `);

      return res.status(200).send({ result });
    } catch (error) {
      log.addLog(
        error,
        "database",
        "Automatic Assignments -> /getAutomaticAssignments"
      );
      return res.status(500).send({ msg: error });
    }
  }
);

module.exports = router;

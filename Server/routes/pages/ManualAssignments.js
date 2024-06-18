const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/getBiddings", auth.ensureAuthenticated, async (req, res) => {
  try {
    //The query will return a list of objects and each object will correspond to the information of 1 submission (submissionid, submission title, main author name and a list of reviewers)
    //The reviewers list will exclude committee member that have a conflict with the submission or are already assigned to the submission
    //If a reviewers list is empty then the submission will not be included in the results
    const result = await db.fetchDataCst(`
    SELECT
      s.submissionid,
      s.submissiontitle,
      STRING_AGG(DISTINCT u.userfirstname || ' ' || u.userlastname, ', ') AS author,
      STRING_AGG(r.userid || ': ' || r.userfirstname || ' ' || r.userlastname, ', ') AS reviewers
    FROM
      submissions s
    JOIN
      users u ON s.submissionmainauthor = u.userid
    LEFT JOIN (
      SELECT
          ur.userid,
          ur.confid,
          us.userfirstname,
          us.userlastname,
          us.useremail
      FROM
        userroles ur
      JOIN
        users us ON ur.userid = us.userid
      WHERE
        ur.userrole IN ('Owner', 'Chair', 'Committee')
        AND ur.confid = ${req.body.confid}
    ) r ON s.submissionconfid = r.confid
    AND NOT EXISTS (
      SELECT 1
      FROM conflicts c
      WHERE c.conflictconfid = s.submissionconfid
        AND c.conflictsubmissionid = s.submissionid
        AND c.conflictuseremail = r.useremail
    )
    AND NOT EXISTS (
      SELECT 1
      FROM reviewsassignments ra
      WHERE ra.assignmentconfid = s.submissionconfid
        AND ra.assignmentsubmissionid = s.submissionid
        AND ra.assignmentuserid = r.userid
        AND ra.assignmentmanually = true 
    )
    WHERE
      s.submissionconfid = ${req.body.confid}
    GROUP BY
      s.submissiontitle,
      s.submissionid
    HAVING
      STRING_AGG(DISTINCT r.userfirstname || ' ' || r.userlastname, ', ') <> '';
  `);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "database", "Manual Assignments -> /getBiddings");
    return res.status(500).send({ msg: "Error getting biddings" });
  }
});

router.post(
  "/createManualAssignment",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      for (const member of req.body.info.reviewers) {
        await db.fetchDataCst(`
          INSERT INTO reviewsassignments (assignmentconfid, assignmentsubmissionid, assignmentuserid, assignmentmanually)
          VALUES (${req.body.confid}, ${req.body.info.id}, ${member.id}, TRUE)
          `);

        //Check if an automatic assignement was already created if yes then we delete it
        const automaticAssignment = await db.fetchDataCst(`
          SELECT 
            assignmentid	
          FROM
            reviewsassignments
          WHERE
            assignmentconfid = ${req.body.confid} AND assignmentsubmissionid = ${req.body.info.id} AND assignmentuserid = ${member.id}
          `);

        if (automaticAssignment) {
          await db.fetchDataCst(`
              DELETE
              FROM 
                reviewsassignments
              WHERE
                assignmentid = ${automaticAssignment[0].assignmentid}
              `);
        }
      }

      return res.status(200).send({ msg: "Assignment created successfully" });
    } catch (error) {
      log.addLog(
        error,
        "database",
        "Manual Assignments -> /createManualAssignment"
      );
      return res.status(500).send({ msg: "Error creating manual assignment" });
    }
  }
);

module.exports = router;

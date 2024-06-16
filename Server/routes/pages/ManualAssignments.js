const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/getBiddings", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
  SELECT
    s.submissionid,
    s.submissiontitle,
    STRING_AGG(DISTINCT u.userfirstname || ' ' || u.userlastname, ', ') AS author,
    STRING_AGG(DISTINCT r.userfirstname || ' ' || r.userlastname, ', ') AS reviewers
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
  WHERE
    s.submissionconfid = ${req.body.confid}
  GROUP BY
    s.submissiontitle,
    s.submissionid;
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
      console.log(req.body.info);
      //await db.fetchDataCst(``);
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

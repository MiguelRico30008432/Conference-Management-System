const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/myReviews", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
        SELECT
            submissionid,
            submissiontitle,
            to_char(submissionadddate, 'DD-MM-YYYY') AS submissionadddate,
            Concat(userfirstname, ' ', userlastname) AS username
        FROM ReviewsAssignments
        INNER JOIN submissions ON submissionid = assignmentsubmissionid
        INNER JOIN users users ON submissionmainauthor = userid
        WHERE 
            assignmentuserid = ${req.body.userid}
        AND assignmentconfid = ${req.body.confid}
        `);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "database", "CreateSubmissions -> /getAuthorData");
    return res.status(500);
  }
});

module.exports = router;

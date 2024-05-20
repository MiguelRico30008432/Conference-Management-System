const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/allSubmissions", auth.ensureAuthenticated, async (req, res) => {
  try {
    const allSubmissions = await db.fetchDataCst(
      `SELECT 
            submissions.submissionid AS id, 
            submissions.submissiontitle AS title, 
            STRING_AGG(CONCAT(authorfirstname, ' ', authorlastname), ', ') AS authors,
            submissions.submissionaccepted AS status,
            to_char(submissions.submissionadddate, 'DD-MM-YYYY') AS addDate,
            submissions.submissionabstract AS abstract
        FROM submissions    
        INNER JOIN authors a1 ON submissions.submissionid = a1.submissionid
        WHERE 
            submissions.submissionconfID = ${req.body.confID}
        GROUP BY
            submissions.submissionid,
            submissions.submissiontitle,
            submissions.submissionaccepted,
            submissions.submissionadddate,
            submissions.submissionabstract`
    );

    return res.status(200).json(allSubmissions);
  } catch (error) {
    log.addLog(error, "database", "AllSubmissions -> /allSubmissions");
    res.status(500).send({ msg: "Error fetching submission data" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/allSubmissions", auth.ensureAuthenticated, async (req, res) => {
  try {
    const allSubmissions = await db.fetchDataCst(`
        SELECT 
            submissions.submissionid AS id, 
            submissions.submissiontitle AS title, 
            CONCAT(userfirstname,' ',userlastname) AS mainauthor,
            STRING_AGG(CONCAT(authorfirstname, ' ', authorlastname), ', ') AS authors,
            CASE 
                WHEN submissions.submissionaccepted = false AND submissions.submissiondecisionmade = true THEN 'Rejected'
                WHEN submissions.submissionaccepted = true THEN 'Accepted'
                ELSE 'Pending'
            END AS status,
            to_char(submissions.submissionadddate, 'DD-MM-YYYY') AS adddate,
            submissions.submissionabstract AS abstract
        FROM submissions    
        INNER JOIN users on userid = submissionmainauthor
        INNER JOIN authors a1 ON submissions.submissionid = a1.submissionid
        WHERE 
            submissions.submissionconfID = ${req.body.confID}
        GROUP BY
            submissions.submissionid,
            submissions.submissiontitle,
            submissions.submissionaccepted,
            submissions.submissiondecisionmade,
            submissions.submissionadddate,
            submissions.submissionabstract,
            userfirstname,
            userlastname`);

    return res.status(200).json(allSubmissions);
  } catch (error) {
    log.addLog(error, "database", "AllSubmissions -> /allSubmissions");
    res.status(500).send({ msg: "Error fetching submission data" });
  }
});

module.exports = router;

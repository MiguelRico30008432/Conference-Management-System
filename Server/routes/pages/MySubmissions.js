const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/mySubmissions", auth.ensureAuthenticated, async (req, res) => {
    try {
        const { confID, userID } = req.body;
        const submissions = await db.queryCst(
            `SELECT 
            submissions.submissionid AS id, 
            submissions.submissiontitle AS title, 
            STRING_AGG(CONCAT(CONCAT(a1.authorfirstname,' ',a1.authorlastname), ', ', CONCAT(a2.authorfirstname,' ',a2.authorlastname)), ', ') AS authors,
            submissions.submissionaccepted AS status,
            submissions.submissionadddate AS addDate, 
            submissions.submissionabstract AS abstract
        FROM
            submissions
            INNER JOIN authors a1 ON submissions.submissionid = a1.submissionid
            LEFT JOIN authors a2 ON submissions.submissionid = a2.submissionid AND a2.userid != ${userID}
        WHERE 
            a1.userid = ${userID} AND submissions.submissionconfID = ${confID}
        GROUP BY
            submissions.submissionid,
            submissions.submissiontitle,
            submissions.submissionaccepted,
            submissions.submissionadddate,
            submissions.submissionabstract;`
        );

        // If no submissions found, return an empty array
        if (submissions.length === 0) {
            return res.status(200).json([]);
        }

        // Return the fetched data
        return res.status(200).json(submissions);
    } catch (error) {
        log.addLog(error, "database", "MySubmissions -> /submissions");
        res.status(500).send({ msg: "Error fetching submission data" });
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/allSubmissions", auth.ensureAuthenticated, async (req, res) => {
    try {
        const allSubmissions = await db.fetchDataCst(
        `SELECT 
            s.submissionadddate,
            s.submissiontitle,
            s.submissionabstract,
            s.submissionid,
            STRING_AGG(CONCAT(a.authorfirstname,' ',a.authorlastname), ', ') AS authors
        FROM 
            submissions s
        INNER JOIN 
            authors a ON s.submissionid = a.submissionid
        WHERE 
            s.submissionconfid = ${req.body.confID}
        GROUP BY 
            s.submissionadddate,
            s.submissiontitle,
            s.submissionabstract,
            s.submissionid;`
        );

        if (allSubmissions.length === 0) {
            return res.status(200).json([]);
        }
        
        return res.status(200).json(allSubmissions);
    } catch (error) {
        log.addLog(error, "database", "AllSubmissions -> /allSubmissions");
        res.status(500).send({ msg: "Error fetching submission data" });
    }
});

module.exports = router;
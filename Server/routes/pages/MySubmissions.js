const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const sb = require("../../utility/supabase");

router.post("/getUpdateInfo", auth.ensureAuthenticated, async (req, res) => {
  try {
    const update = await db.fetchDataCst(
      `SELECT 
        confsubupdate AS update
      FROM
        conferences 
      WHERE
        confid = ${req.body.confid}`
    );

    return res.status(200).json(update);
  } catch (error) {
    log.addLog(error, "database", "MySubmissions -> /getUpdateInfo");
    res
      .status(500)
      .send({ msg: "Error fetching submission update definition" });
  }
});

router.post("/mySubmissions", auth.ensureAuthenticated, async (req, res) => {
  try {
    const { confID, userID } = req.body;
    const submissions = await db.fetchDataCst(
      ` SELECT 
            submissions.submissionid AS id, 
            submissions.submissiontitle AS title, 
            CONCAT(userfirstname,' ',userlastname) AS mainauthor,
            STRING_AGG(CONCAT(CONCAT(a1.authorfirstname,' ',a1.authorlastname), ', ', CONCAT(a2.authorfirstname,' ',a2.authorlastname)), ', ') AS authors,
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
        LEFT JOIN authors a2 ON submissions.submissionid = a2.submissionid AND a2.userid !=  ${userID}
        WHERE 
            a1.userid =  ${userID} AND submissions.submissionconfID =  ${confID}
        GROUP BY
            submissions.submissionid,
            submissions.submissiontitle,
            submissions.submissionaccepted,
            submissions.submissiondecisionmade,
            submissions.submissionadddate,
            submissions.submissionabstract,
            userfirstname,
            userlastname;`
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

router.post("/authors", auth.ensureAuthenticated, async (req, res) => {
  try {
    const { confID, submissionID } = req.body;
    const submissions = await db.fetchDataCst(`   
      SELECT
        STRING_AGG(CONCAT(a1.authorfirstname,' ',a1.authorlastname), ' ') AS authors
      FROM submissions
      INNER JOIN authors a1 ON submissions.submissionid = a1.submissionid
      WHERE
        submissions.submissionconfID = ${confID} AND submissions.submissionid = ${submissionID}`);

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

router.delete(
  "/deleteSubmission",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const submissionID = req.body.submissionID;

      if (!submissionID) {
        return res.status(400).send({ msg: "Submission ID is required" });
      }

      const submissionToDeleteInfo = await db.fetchDataCst(`
        SELECT
        submissionconfid,
        submissionmainauthor
        FROM
        submissions
        WHERE
        submissionid = ${submissionID} 
      `);

      await db.fetchDataCst(
        `DELETE FROM authors WHERE submissionid = ${submissionID}`
      );

      await db.fetchDataCst(
        `DELETE FROM submissions WHERE submissionid = ${submissionID}`
      );

      const remainingSubmissions = await db.fetchDataCst(
        `SELECT COUNT(*) FROM submissions WHERE submissionmainauthor = ${submissionToDeleteInfo[0].submissionmainauthor} AND submissionconfid = ${submissionToDeleteInfo[0].submissionconfid}`
      );

      if (parseInt(remainingSubmissions[0].count) === 0) {
        await db.fetchDataCst(
          `DELETE FROM userroles WHERE userid = ${submissionToDeleteInfo[0].submissionmainauthor} AND userrole = 'Author' AND confid = ${submissionToDeleteInfo[0].submissionconfid}`
        );
      }

      await sb.deleteSubmissionFile(
        submissionToDeleteInfo[0].submissionconfid,
        submissionID,
        submissionToDeleteInfo[0].submissionmainauthor
      );

      return res.status(200).send({ msg: "Submission deleted successfully." });
    } catch (error) {
      log.addLog(error, "database", "DeleteSubmission -> /deleteSubmission");
      return res
        .status(500)
        .send({ msg: "Error deleting submission", error: error.message });
    }
  }
);

router.post(
  "/downloadSubmissionFile",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const { submissionID } = req.body;

      if (!submissionID) {
        return res.status(400).send({ msg: "Submission ID is required" });
      }

      const fileToDownloadInfo = await db.fetchDataCst(`
        SELECT
        submissionconfid,
        submissionmainauthor
        FROM
        submissions
        WHERE
        submissionid = ${submissionID} 
      `);

      if (fileToDownloadInfo.length === 0) {
        return res.status(404).send({ msg: "Submission file not found" });
      }

      const file = await sb.getSubmissionFile(
        fileToDownloadInfo[0].submissionconfid,
        submissionID,
        fileToDownloadInfo[0].submissionmainauthor
      );

      if (!file) {
        return res.status(404).send({ msg: "File not found" });
      }

      const fileBuffer = await file.arrayBuffer();
      res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
      res.setHeader("Content-Type", file.type);
      res.send(Buffer.from(fileBuffer));
    } catch (error) {
      return res.status(500).send({
        msg: "Error downloading submission file",
        error: error.message,
      });
    }
  }
);

module.exports = router;

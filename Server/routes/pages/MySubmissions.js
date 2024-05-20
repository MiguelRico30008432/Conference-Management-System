const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const sb = require("../../utility/supabase");

router.post("/mySubmissions", auth.ensureAuthenticated, async (req, res) => {
  try {
    const { confID, userID } = req.body;
    const submissions = await db.fetchDataCst(
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

router.delete(
  "/deleteSubmission",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const { submissionID } = req.body;

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

      log.addLog(
        `Fetching submission details for submissionID: ${submissionID}`,
        "database",
        "DownloadSubmissionFile -> /downloadSubmissionFile"
      );

      const submissionDetails = await db.fetchDataCst(
        `SELECT submissionmainauthor AS "submissionMainAuthor", submissionconfid AS "submissionConfID" FROM submissions WHERE submissionid = ${submissionID}`
      );

      log.addLog(
        `Query result: ${JSON.stringify(submissionDetails)}`,
        "database",
        "DownloadSubmissionFile -> /downloadSubmissionFile"
      );

      if (submissionDetails.length === 0) {
        log.addLog(
          `Submission not found for submissionID: ${submissionID}`,
          "database",
          "DownloadSubmissionFile -> /downloadSubmissionFile"
        );
        return res.status(404).send({ msg: "Submission not found" });
      }

      const { submissionMainAuthor, submissionConfID } = submissionDetails[0];

      log.addLog(
        `Found submission details: mainAuthor: ${submissionMainAuthor}, confID: ${submissionConfID}`,
        "database",
        "DownloadSubmissionFile -> /downloadSubmissionFile"
      );

      const file = await sb.getSubmissionFile(
        submissionConfID,
        submissionID,
        submissionMainAuthor
      );

      if (!file) {
        log.addLog(
          `File not found for submissionID: ${submissionID}`,
          "database",
          "DownloadSubmissionFile -> /downloadSubmissionFile"
        );
        return res.status(404).send({ msg: "File not found" });
      }

      log.addLog(
        `File successfully retrieved: ${file.name}`,
        "database",
        "DownloadSubmissionFile -> /downloadSubmissionFile"
      );

      res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
      res.setHeader("Content-Type", file.type);
      res.send(file.data);
    } catch (error) {
      log.addLog(
        `Backend catch error: ${error.message}`,
        "database",
        "DownloadSubmissionFile -> /downloadSubmissionFile"
      );
      return res.status(500).send({
        msg: "Error downloading submission file",
        error: error.message,
      });
    }
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const email = require("../../utility/emails");

// Fetch all submissions with their average grades
router.post("/allSubmissionsDecisions", auth.ensureAuthenticated, async (req, res) => {
  const { confid } = req.body;

  try {
    const queryText = `
      SELECT
        submissions.submissionid,
        submissions.submissiontitle,
        STRING_AGG(DISTINCT authors.authorfirstname || ' ' || authors.authorlastname, ', ') AS authors,
        TRIM(TO_CHAR(AVG(reviews.reviewgrade), '999D9'))::float AS averagegrade,
        submissions.submissiondecisionmade,
        submissions.submissionaccepted
      FROM
        submissions
      LEFT JOIN
        reviewsassignments ON submissions.submissionid = reviewsassignments.assignmentsubmissionid
      LEFT JOIN
        reviews ON reviewsassignments.assignmentid = reviews.reviewassignmentid
      LEFT JOIN
        authors ON submissions.submissionid = authors.submissionid
      WHERE
        submissions.submissionconfid = $1 
        AND submissions.submissionaccepted = false
        AND submissions.submissiondecisionmade = false
      GROUP BY
        submissions.submissionid, submissions.submissiontitle
      ORDER BY
        submissions.submissionid;
    `;
    const result = await db.pool.query(queryText, [confid]);


    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in /allSubmissionsDecisions:", err); // Improved logging
    log.addLog(err, "backend", "allSubmissionsDecisions");
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
});

// Fetch detailed review information for a specific submission
router.post("/submissionDecisionDetails", auth.ensureAuthenticated, async (req, res) => {
  const { submissionId } = req.body;

  try {
    const queryText = `
      SELECT
        users.userfirstname,
        users.userlastname,
        reviews.reviewgrade,
        reviews.reviewtext
      FROM
        reviews
      LEFT JOIN
        reviewsassignments ON reviews.reviewassignmentid = reviewsassignments.assignmentid
      LEFT JOIN
        users ON reviewsassignments.assignmentuserid = users.userid
      WHERE
        reviewsassignments.assignmentsubmissionid = $1;
    `;
    const result = await db.pool.query(queryText, [submissionId]);

    res.status(200).json(result.rows);
  } catch (err) {
    log.addLog(err, "backend", "submissionDecisionDetails");
    res.status(500).json({ message: "Failed to fetch submission details" });
  }
});

router.post("/acceptOrRejectDecision", auth.ensureAuthenticated, async (req, res) => {
  const { submissionId, acceptOrReject } = req.body;

  try {
    let queryText = '';
    let actionTaken = '';

    if (acceptOrReject === 2) {
      console.log("Accepting submission");
      queryText = `
        UPDATE submissions 
        SET submissionaccepted = true, 
            submissiondecisionmade = true 
        WHERE submissionid = $1;
      `;
      actionTaken = 'accepted';
    } else if (acceptOrReject === 1) {
      console.log("Rejecting submission");
      queryText = `
        UPDATE submissions 
        SET submissiondecisionmade = true 
        WHERE submissionid = $1;
      `;
      actionTaken = 'rejected';
    }

    // Execute the update query
    await db.pool.query(queryText, [submissionId]);

    // Fetch submission and all author details
    const submissionDetailsQuery = `
      SELECT 
        submissions.submissiontitle,
        authors.authoremail 
      FROM 
        submissions
      LEFT JOIN 
        authors ON submissions.submissionid = authors.submissionid
      WHERE 
        submissions.submissionid = $1;
    `;

    const submissionDetailsResult = await db.pool.query(submissionDetailsQuery, [submissionId]);

    if (submissionDetailsResult.rows.length === 0) {
      return res.status(404).send({ msg: "Submission or author not found." });
    }

    const emailSubject = `Submission Status Update`;
    const submissiontitle = submissionDetailsResult.rows[0].submissiontitle;
    
    
    const emailAddresses = submissionDetailsResult.rows.map(row => row.authoremail);
    const toEmails = emailAddresses.join(", ");

    const replacements = {
      submissionTitle: submissiontitle,
      actionTaken: actionTaken
    };

    // Send email notification to all authors at once
    email.sendEmail(toEmails, emailSubject, replacements, "emailSubmission.html", (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).send({ msg: "Submission decision updated successfully." });
  } catch (error) {
    console.error("Error in /acceptOrRejectDecision:", error);
    log.addLog(error, "backend", "acceptOrRejectDecision");
    res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;
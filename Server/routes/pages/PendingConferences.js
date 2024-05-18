const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const email = require("../../utility/emails");
const router = express.Router();

router.get(
  "/pendingConferences",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const queryText = `
      SELECT 
        conferences.confid AS "id",
        conferences.confname,
        conferences.confdescription,
        to_char(conferences.confstartdate, 'DD-MM-YYYY HH24:MI:SS') AS confstartdate,
        to_char(conferences.confenddate, 'DD-MM-YYYY HH24:MI:SS') AS confenddate,
        to_char(conferences.confstartsubmission, 'DD-MM-YYYY HH24:MI:SS') AS confstartsubmission,
        to_char(conferences.confendsubmission, 'DD-MM-YYYY HH24:MI:SS') AS confendsubmission,
        to_char(conferences.confstartreview, 'DD-MM-YYYY HH24:MI:SS') AS confstartreview,
        to_char(conferences.confendreview, 'DD-MM-YYYY HH24:MI:SS') AS confendreview,
        to_char(conferences.confstartbidding, 'DD-MM-YYYY HH24:MI:SS') AS confstartbidding,
        to_char(conferences.confendbidding, 'DD-MM-YYYY HH24:MI:SS') AS confendbidding,
        confAreas.confareaname,
        conferences.confmaxreviewers,
        conferences.confminreviewers,
        conferences.confadddate,
        conferences.confapproved,
        conferences.confOwner
      FROM conferences
      INNER JOIN confareas ON confareas.confareaid = conferences.confareaid
      WHERE confapproved = 0`;

      const result = await db.fetchDataCst(queryText);
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

router.post("/acceptOrRejectConference", async function (req, res) {
  try {
    // Update information in the database
    await db.updateData(
      "conferences",
      { confapproved: req.body.acceptOrReject },
      { confid: req.body.confid }
    );

    //Create new event to show on events page
    if (req.body.acceptOrReject === 2) {
      await db.createEvent(
        req.body.confid,
        1, //admin
        "The conference has been accepted"
      );
    }

    // Fetch the user's email
    const userRecords = await db.fetchData(
      "users",
      "userid",
      req.body.confowner
    );

    const userEmail = userRecords[0].useremail;
    const userName =
      userRecords[0].userfirstname + " " + userRecords[0].userlastname;

    // Define the subject and content of the email based on the accept or reject action
    const emailSubject = "Conference Submission Status Update";
    const emailReplacements = {
      userName: userName,
      conferenceTitle: req.body.confname,
      actionTaken: req.body.acceptOrReject === 2 ? "accepted" : "rejected",
      additionalInfo: "For more information, please contact our support team.",
    };

    email.sendEmail(
      userEmail,
      emailSubject,
      emailReplacements,
      "emailAcceptReject.html"
    );

    return res.status(200).send({ msg: `Email notification sent.` });
  } catch (error) {
    console.error("Error in /acceptOrRejectConference:", error);
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

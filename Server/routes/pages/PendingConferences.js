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
        conferences.confowner AS confownerID,
        conferences.confid AS "id",
        conferences.confname,
        conferences.confdescription,
        to_char(conferences.confstartdate, 'DD-MM-YYYY') AS confstartdate,
        to_char(conferences.confenddate, 'DD-MM-YYYY') AS confenddate,
        to_char(conferences.confstartsubmission, 'DD-MM-YYYY') AS confstartsubmission,
        to_char(conferences.confendsubmission, 'DD-MM-YYYY') AS confendsubmission,
        to_char(conferences.confstartreview, 'DD-MM-YYYY') AS confstartreview,
        to_char(conferences.confendreview, 'DD-MM-YYYY') AS confendreview,
        to_char(conferences.confstartbidding, 'DD-MM-YYYY') AS confstartbidding,
        to_char(conferences.confendbidding, 'DD-MM-YYYY') AS confendbidding,
        to_char(conferences.confadddate, 'DD-MM-YYYY') AS confadddate,
        STRING_AGG(users.userfirstname || ' ' || users.userlastname, ', ') AS confowner,
        STRING_AGG(conferences.confcountry || ' (' || conferences.confcity || ')', ', ') AS confLocation,
        confareas.confareaname,
        conferences.confwebpage,
        conferences.confapproved,
        conferences.confcontact,
        conftypes.conftypename
      FROM conferences
      INNER JOIN confareas ON confareas.confareaid = conferences.confareaid
      INNER JOIN users ON users.userid = conferences.confowner
      INNER JOIN conftypes ON conftypes.conftypeid = conferences.conftype
      WHERE conferences.confapproved = 0
      GROUP BY 
        conferences.confid, 
        conferences.confname, 
        conferences.confdescription, 
        conferences.confstartdate, 
        conferences.confenddate, 
        conferences.confstartsubmission, 
        conferences.confendsubmission, 
        conferences.confstartreview, 
        conferences.confendreview, 
        conferences.confstartbidding, 
        conferences.confendbidding, 
        conferences.confadddate, 
        confareas.confareaname, 
        conferences.confwebpage, 
        conferences.confapproved,
        conferences.confcontact,
        conftypes.conftypename
`;

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
    console.log("Cheguei aqui 5");
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

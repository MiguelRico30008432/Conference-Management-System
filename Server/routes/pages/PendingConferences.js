const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.get(
  "/pendingConferences",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataPendingConferences("confapproved", 0);
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

    sendEmail(userEmail, emailSubject, emailReplacements);

    return res.status(200).send({ msg: `Email notification sent.` });
  } catch (error) {
    console.error("Error in /acceptOrRejectConference:", error);
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

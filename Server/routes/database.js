const express = require("express");
const db = require("../utility/database");
const auth = require("../utility/verifications");
const { sendEmail } = require("../utility/emails");
const bcrypt = require("bcrypt");
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
    if (userRecords.length === 0) {
      return res.status(404).send({ msg: "User not found" });
    }
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

router.post("/userData", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchUserData("userid", req.body.userID);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/saveUserData", auth.ensureAuthenticated, async (req, res) => {
  try {
    await db.updateData(
      "users",
      {
        userFirstName: req.body.firstName,
        userLastName: req.body.lastName,
        userEmail: req.body.email,
        userPhone: req.body.phone,
      },
      { userid: req.body.userID }
    );
    return res.status(200).send({ msg: "" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/saveUserPassword", auth.ensureAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
    await db.updateData(
      "users",
      {
        userPassword: hashedPassword,
      },
      { userid: req.body.userID }
    );
    return res.status(200).send({ msg: "" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

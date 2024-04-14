const express = require("express");
const db = require("../utility/database");
const auth = require("../utility/verifications");
const { sendEmail } = require("../utility/emails");
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
    //Update Info on Database
    await db.updateData(
      "conferences",
      { confapproved: req.body.acceptOrReject },
      { confid: req.body.confid }
    );
    // Fetch the Email from Database
    const userRecords = await db.fetchData(
      "users",
      "userid",
      req.body.confowner
    );
    if (userRecords.length === 0) {
      return res.status(404).send({ msg: "User not found" });
    }
    console.log(userRecords);
    const userEmail = userRecords[0].useremail;
    console.log(userEmail);

    // Send Email
    const subject =
      req.body.acceptOrReject === 2
        ? "Your conference as been Accepted"
        : "Your conference as been Rejected";
    const contentsubject =
      req.body.acceptOrReject === 2 ? "Accepted" : "Rejected";
    const content = `Your conference submission has been ${contentsubject.toLowerCase()}. Thank you for your patience.`;
    sendEmail(userEmail, subject, content);

    return res.status(200).send({ msg: "Update successful, email sent." });
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

module.exports = router;

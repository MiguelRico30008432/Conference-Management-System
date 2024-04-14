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
      console.log(result);
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

router.post("/acceptOrRejectConference", async function (req, res) {
  try {
    await db.updateData(
      "conferences",
      { confapproved: req.body.acceptOrReject },
      { confid: req.body.confid }
    );
    
    
    const testEmail = "30009280@students.ual.pt";
    
    
    const subject = req.body.acceptOrReject === 2 ? "Conference Accepted" : "Conference Rejected";
    const content = `Your conference submission has been ${subject.toLowerCase()}. Thank you for your patience.`;
    
    // Send an email notification to the test email
    sendEmail(testEmail, subject, content);

    return res.status(200).send({ msg: "Update successful, email sent." });
  } catch (error) {
    console.error("Error in /acceptOrRejectConference:", error);
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

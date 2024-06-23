const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();
const { sendEmail } = require("../../utility/emails");

router.post("/sendComposeEmail", auth.ensureAuthenticated, async (req, res) => {
  const { recipient, subject, description, confID } = req.body;

  if (!subject || !description || !confID) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    let queryText;
    if (recipient === "all") {
      queryText = `
        SELECT useremail
        FROM users
        JOIN userroles ON users.userid = userroles.userid
        WHERE userroles.confID = $1 AND userroles.userrole IN ('Owner', 'Chair', 'Committee');
      `;
    } else if(recipient === "chair") {
      queryText = `
        SELECT useremail
        FROM users
        JOIN userroles ON users.userid = userroles.userid
        WHERE userroles.confID = $1 AND userroles.userrole IN ('Owner', 'Chair');
      `;
    } else if(recipient === "committee") {
      queryText = `
        SELECT useremail
        FROM users
        JOIN userroles ON users.userid = userroles.userid
        WHERE userroles.confID = $1 AND userroles.userrole = 'Committee';
      `;
    }

    const result = await db.fetchDataCst(queryText, [confID]);

    if (!result || !Array.isArray(result)) {
      return res.status(404).json({ success: false, message: "No recipients found." });
    }

    const emails = result.map((row) => row.useremail);
    const formattedDescription = description.split("\n").join("<br />");

    await sendEmail(emails, subject, { descriptionEmail: formattedDescription }, 'SendComposeEmail.html', (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred while sending the email." });
      }
      res.status(200).json({ success: true, message: "Emails sent successfully." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while sending the email." });
  }
});

// Checks if there are any committee members
router.get("/checkCommitteeMembers", async (req, res) => {
  const { confID } = req.query;
  try {
    // Query the database to check if there are any committee members for the given conference ID
    const committeeMembers = await db.fetchData('userroles', 'confID', confID);
    
    // Check if committeeMembers is defined and not empty before using some()
    const committeeMembersExist = committeeMembers && committeeMembers.length > 0 && committeeMembers.some(member => member.userrole === 'Committee');
    // Send response indicating if committee members exist
    res.status(200).json({ committeeMembersExist });
  } catch (error) {
    console.error("Error checking committee members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
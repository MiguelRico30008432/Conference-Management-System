const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();
const { sendEmail } = require("../../utility/emails");



router.post("/sendComposeEmail", auth.ensureAuthenticated, async (req, res) => {
  const { recipient, subject, description, confID } = req.body;
  
  // Validate the required fields
  if (!subject || !description || !confID) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    let result;
    let emailReplacements = { descriptionEmail: description };

    if (recipient === "all") {
      // Fetch all users who are Chairs or Committee members
      result = await db.fetchAllEmailData(
        'users', // Main table
        'userroles', // Join table
        'userid', // Join condition
        'confID', // Second Join Condition
        'useremail', // Filter column
        'userrole', // Second Filter Column
        confID, // Filter First Value
        ['Chair', 'Committee'] // Filter Second Value: Chairs and Committees
      );
    } else {
      //DB Query with Join
      const recipientCapitalized = recipient.charAt(0).toUpperCase() + recipient.slice(1);
      result = await db.fetchDataWithJoin(
        'users', // Main table
        'userroles', // Join table
        'userid', // Join condition
        'confID', // Second Join Condition
        'useremail', // Filter column
        'userrole', // Second Filter Column
        confID, // Filter First Value
        recipientCapitalized // Filter Second Value (capitalized)
      );
    }


      await sendEmail(result, subject, emailReplacements, 'SendComposeEmail.html', (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ success: false, message: "An error occurred while sending the email." });
        }
      });

    res.status(200).json({ success: true, message: "Emails sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred while sending the email." });
  }
});

module.exports = router;
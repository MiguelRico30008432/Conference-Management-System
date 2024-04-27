const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();
const { sendEmail } = require("../../utility/emails");

router.post("/sendComposeEmail", auth.ensureAuthenticated, async (req, res) => {
    const { recipient, subject, description, confID } = req.body;
    // Validate the required fields "doublecheck"
    if (!recipient || !subject || !description || !confID) {
      return res.status(400).send("Missing required fields.");
    }
    //DB Query with Join
    const recipientCapitalized = recipient.charAt(0).toUpperCase() + recipient.slice(1);
    const result = await db.fetchDataWithJoin(
      'users', // Main table
      'userroles', // Join table
      'userid', // Join condition
      'confID', // Second Join Condition
      'useremail', // Filter column
      'userrole', // Second Filter Column
      confID, // Filter First Value
      recipientCapitalized // Filter Second Value (capitalized)
    );

    const emailReplacements = {
      descriptionEmail: description,
    };

    try {
  
      // Call the external function
      await sendEmail(result, subject, emailReplacements, 'SendComposeEmail.html');
      
      res.status(200).send("Email sent successfully.");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while sending the email.");
    }

});


module.exports = router;
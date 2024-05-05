const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();
const { sendEmail } = require("../../utility/emails");
const crypto = require('crypto');

function generateRandomCode(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal string
        .slice(0, length); // Trim to desired length
}

router.post("/sendNewInvitation", auth.ensureAuthenticated, async (req, res) => {
  const { role, recipients, confID } = req.body;
  const confInfo = await db.fetchData('conferences', 'confID', confID);
  const confName = confInfo[0].confname;

  // Function to generate a random invitation code
  function generateRandomCode(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex') // Convert to hexadecimal string
      .slice(0, length); // Trim to desired length
  }

  // Function to send invitations recursively with a delay between each email
  async function sendInvitations(index) {
    if (index < recipients.length) {
      const recipient = recipients[index];
      const randomCode = generateRandomCode(8);
      let emailReplacements = {
        confName: confName,
        generatedCode: randomCode
      };

      // Send email with invitation
      sendEmail(recipient, 'Conference Invitation', emailReplacements, 'emailInvitation.html', async (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          // Skip adding invitation to the database if email sending fails
        } else {
          // Add invitation to the database if email sending succeeds
          try {
            await db.addData('invitations', {
              confid: confID,
              invitationemail: recipient,
              invitationcode: randomCode,
              invitationrole: role,
              invitationcodeused: false
            });
          } catch (error) {
            console.error("Error adding invitation to database:", error);
          }
        }

        // Continue sending invitations recursively after a delay of 1 second
        setTimeout(() => {
          sendInvitations(index + 1);
        }, 50); 
      });
    } else {
      // If all invitations have been sent, respond with success message
      res.status(200).json({ success: true, message: "Invitations sent successfully." });
    }
  }

  // Start sending invitations from the first recipient
  sendInvitations(0);
});

router.get("/checkInvitations", async (req, res) => {
    const { confID } = req.query;
    try {
        const invitationsSent = await db.fetchData('invitations', 'confID', confID);
        res.status(200).json({ invitationsSent });
    } catch (error) {
        console.error("Error checking invites:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/deleteInvitation', auth.ensureAuthenticated, async (req, res) => {
    const { invitationId } = req.body;
    try {
        await db.deleteData('invitations', 'invitationid', invitationId);
        res.status(200).json({ message: 'Invitation deleted successfully' });
    } catch (error) {
        console.error('Error deleting invitation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
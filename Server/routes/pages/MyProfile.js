const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/userData", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
    SELECT 
      userfirstname,
      userlastname,
      useremail,
      userphone,
      useraffiliation
    FROM users
    WHERE userid = ${req.body.userID}`;

    const result = await db.fetchDataCst(query);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/saveUserData", auth.ensureAuthenticated, async (req, res) => {
  try {
    const userRecords = await db.fetchData(
      "users",
      "useremail",
      req.body.email
    );

    if (userRecords.length != 0 && userRecords[0].userid != req.body.userID) {
      return res.status(404).send({ msg: "Email already in use" });
    }

    await db.updateData(
      "users",
      {
        userfirstName: req.body.firstName,
        userlastName: req.body.lastName,
        useremail: req.body.email,
        userphone: req.body.phone,
        useraffiliation: req.body.affiliation,
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



router.post("/saveInvitationCode", auth.ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.body.userID;
    const userInfo = await db.fetchData("users", "userid", userId);
    const userEmail = userInfo[0].useremail;

    const invitationInfo = await db.fetchData("invitations", "invitationemail", userEmail);

    let inviteFound = false;
    for (const invite of invitationInfo) {
      const userRole = invite.invitationrole;
      const confID = invite.confid;
      const invitationCode = invite.invitationcode;

      if (invitationCode === req.body.inviteCode && userInfo[0].userid === userId) {
        const infoExists = await db.fetchData("userroles", "userid", userId);

        // Check if the role for this conference ID already exists for the user
        const existingRole = infoExists.find(info => info.confid === confID && info.userrole === userRole);

        if (existingRole) {
          return res.status(409).send({ msg: "This code is already registered." });
        } else {
          await db.addData("userroles", {
            userid: req.body.userID,
            userrole: userRole,
            confid: confID
          });
          inviteFound = true;
        }
      }
    }

    if (inviteFound) {
      return res.status(200).send({ msg: "Invitation code registered successfully." });
    } else {
      return res.status(403).send({ msg: "This code isn't associated with your user." });
    }
  } catch (error) {
      return res.status(500).send({ msg: "Internal Error"});
  }
});



module.exports = router;

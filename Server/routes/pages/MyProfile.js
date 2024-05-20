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
    const userInfo = await db.fetchData("users", "userid", req.body.userID);
    const userEmail = userInfo[0].useremail;
    const invitationInfo = await db.fetchData("invitations", "invitationemail", userEmail);
    const userRole = invitationInfo[0].invitationrole;
    const confID = invitationInfo[0].confid;

    if (invitationInfo[0].invitationcode === req.body.inviteCode && 
      userInfo[0].userid === req.body.userID) {
    await db.addData("userroles", {
        userid: req.body.userID,
        userrole: userRole,
        confid: confID
      });
    return res.status(200).send({ msg: "" }); 
  } else {
    return res.status(403).send({ msg: "This code isn't associated with your user." });
  }} catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});


module.exports = router;

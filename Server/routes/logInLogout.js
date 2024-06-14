const express = require("express");
const router = express.Router();
const db = require("../utility/database");
const mail = require("../utility/emails");
const auth = require("../utility/verifications");
const bcrypt = require("bcrypt");
const passport = require("passport");

//Login
router.post("/signIn", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "An error occurred during authentication.",
      });
    }
    if (!user) {
      // Check the message from Passport to determine the reason for failure
      if (info.message === "User Not Found") {
        return res
          .status(404)
          .send({ success: false, message: "User not found." });
      } else {
        return res.status(401).send({
          success: false,
          message: "Unauthorized. Invalid credentials.",
        });
      }
    }

    // If this function gets called, authentication was successful
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .send({ success: false, message: "Failed to establish a session." });
      }
      // Successful authentication, send user details
      return res.status(200).send({
        userid: user.userid,
        useremail: user.useremail,
        useradmin: user.useradmin,
      });
    });
  })(req, res, next);
});

// User Registration
router.post("/signUp", async (req, res) => {
  const { firstName, lastName, password, email, phone, affiliation, inviteCode } = req.body;

  try {
    const findUserName = await db.fetchData("users", "useremail", email);

    if (!findUserName.length) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        userfirstname: firstName,
        userlastname: lastName,
        useremail: email,
        userphone: phone,
        userpassword: hashedPassword,
        useraffiliation: affiliation,
      };

      if (inviteCode.length !== 0) {
        const invitationInfo = await db.fetchData("invitations", "invitationemail", email);

        let inviteFound = false;
        for (const invite of invitationInfo) {
          const userRole = invite.invitationrole;
          const confID = invite.confid;
          const invitationCode = invite.invitationcode;
          const invitationEmail = invite.invitationemail;

          if (inviteCode === invitationCode && email === invitationEmail) {
            inviteFound = true;
            await db.addData("users", newUser);
            const userInfo = await db.fetchData("users", "useremail", email);
            const userId = userInfo[0].userid;
            await db.addData("userroles", {
              userid: userId,
              userrole: userRole,
              confid: confID
            });
            await db.updateData("invitations", { invitationcodeused: 't' }, { invitationid: invite.invitationid });
          }
        }

        if (inviteFound) {
          return res.status(201).send({ msg: "User created." });
        } else {
          return res.status(403).send({ msg: "This code isn't associated with your user." });
        }
      } else {
        await db.addData("users", newUser);
        return res.status(201).send({ msg: "User created." });
      }
    } else {
      return res.status(409).send({ msg: "User already exists." });
    }
  } catch (error) {
    console.error("Error when creating the user: ", error);
    return res.status(500).send({ msg: "Internal server error", error: error.message });
  }
});

//Logout
router.post("/logOut", auth.ensureAuthenticated, (request, response) => {
  request.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return response
        .status(500)
        .send({ success: false, message: "Error logging out" });
    }
    request.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return response
          .status(500)
          .send({ success: false, message: "Error destroying session" });
      }
      response
        .status(200)
        .send({ success: true, message: "Logged out successfully" });
    });
  });
});
//Endpoint used for giving info about the user to the frontend pages
router.get("/authUser", auth.ensureAuthenticated, (req, res) => {
  const { userid, useremail, useradmin } = req.user;
  res.json({ userid, useremail, useradmin });
});

module.exports = router;

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
        // If the user doesn't exist
        return res
          .status(404)
          .send({ success: false, message: "User not found." });
      } else {
        // For other authentication failures, such as incorrect password
        return res.status(401).send({
          success: false,
          message: "Unauthorized. Invalid credentials.",
        });
      }
    }
    // If this function gets called, authentication was successful.
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        // Handle error during the login session establishment
        return res
          .status(500)
          .send({ success: false, message: "Failed to establish a session." });
      }
      //adcição da informação do user à cookie (userid e admin)
      res.cookie("UserID", user.userid, { maxAge: 3600000, httpOnly: false });
      res.cookie("Admin", user.useradmin, { maxAge: 3600000, httpOnly: false });
      // Successful authentication
      return res
        .status(200)
        .send({ success: true, message: "Authenticated successfully" });
    });
  })(req, res, next);
});

//User Registration
router.post("/signUp", async (req, res) => {
  const { firstName, lastName, password, email, phone, affiliation } = req.body;

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

      await db.addData("users", newUser);

      return res.status(201).send({ msg: "Utilizador criado com sucesso" });
    } else {
      console.log("Utilizador já existe");
      return res.status(409).send({ msg: "Utilizador já existe" });
    }
  } catch (error) {
    console.error("Erro ao criar o utilizador: ", error);
    return res
      .status(500)
      .send({ msg: "Erro interno de servidor", error: error.message });
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

module.exports = router;

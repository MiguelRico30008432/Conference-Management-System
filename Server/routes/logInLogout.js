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
      console.error("Authentication error:", err);
      return res.status(500).send({
        success: false,
        message: "An error occurred during authentication.",
      });
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.status(401).send({
        success: false,
        message: info.message,
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.status(500).send({
          success: false,
          message: "Failed to establish a session.",
        });
      }
      console.log("Authentication successful, user:", user);
      console.log("Session data:", req.session);
      res.cookie("testCookie", "testValue", {
        maxAge: 60000 * 60 * 3,
        sameSite: 'None',
        secure: true,
        httpOnly: true,
      });
      console.log("Cookies: ", res.get('Set-Cookie'));
      return res.status(200).send({
        userid: user.userid,
        useremail: user.useremail,
        useradmin: user.useradmin,
      });
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
//Endpoint used for giving info about the user to the frontend pages
router.get("/authUser", auth.ensureAuthenticated, (req, res) => {
  const { userid, useremail, useradmin } = req.user;
  res.json({ userid, useremail, useradmin });
});

module.exports = router;

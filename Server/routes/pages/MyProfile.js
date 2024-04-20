const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/userData", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchUserData("userid", req.body.userID);
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

module.exports = router;

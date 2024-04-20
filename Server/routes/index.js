const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const logInLogoutRouter = require("./logInLogout");
const pendingConferences = require("./pages/PendingConferences");
const myProfile = require("./pages/MyProfile");
const myConferences = require("./pages/MyConferences");

router.use(logInLogoutRouter);
router.use(usersRouter);
router.use(pendingConferences);
router.use(myProfile);
router.use(myConferences);

module.exports = router;

const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const logInLogoutRouter = require("./logInLogout");
const dataBaseRouter = require("./database");

router.use(logInLogoutRouter);
router.use(usersRouter);
router.use(dataBaseRouter);

module.exports = router;

const express = require('express');
const router = express.Router(); 

const usersRouter = require('./users');
const logInLogoutRouter = require('./logInLogout');

router.use(usersRouter);
router.use(logInLogoutRouter);

module.exports = router;
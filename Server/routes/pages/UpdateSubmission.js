const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post(
  "/updateSubmission",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
        
    } catch (error) {
      log.addLog(error, "updateSubmission", "updateSubmission");
      return res.status(500).send({ msg: error });
    }
  }
);

router.post(
  "/getSubmissionInfo",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
        
    } catch (error) {
      log.addLog(error, "updateSubmission", "getSubmissionInfo");
      return res.status(500).send({ msg: error });
    }
  }
);

module.exports = router;

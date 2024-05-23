const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post(
  "/getSubmissionsForBidding",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      return res.status(200).send({});
    } catch (error) {
      log.addLog(error, "endpoint", "getSubmissionsForBidding");
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

router.post("/saveBidding", auth.ensureAuthenticated, async (req, res) => {
  try {
    return res.status(200).send({});
  } catch (error) {
    log.addLog(error, "endpoint", "getSubmissionsForBidding");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

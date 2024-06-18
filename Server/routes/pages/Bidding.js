const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const al = require("../../utility/algorithms");

router.post(
  "/reviewsAssignmentsAlgorithm",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const response = await al.ReviewsAssignmentAlgorihtm(req.body.confid);
      return res.status(200).send({ msg: response });
    } catch (error) {
      log.addLog(error, "database", "Bidding -> /reviewsAssignmentsAlgorithm");
      return res.status(500).send({ msg: response });
    }
  }
);

router.post(
  "/getSubmissionsForBidding",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataCst(`
    SELECT
      s.submissionid,
      s.submissiontitle
    FROM
      submissions s
    WHERE
      s.submissionconfid = ${req.body.confid}
      AND NOT EXISTS (
          SELECT 1
          FROM biddings b
          WHERE b.biddingsubmissionid = s.submissionid
            AND b.biddinguserid = ${req.body.userid}
      )
      AND NOT EXISTS (
          SELECT 1
          FROM conflicts c
          JOIN users u ON u.useremail = c.conflictuseremail
          WHERE c.conflictsubmissionid = s.submissionid
            AND u.userid = ${req.body.userid})
    `);
      return res.status(200).send(result);
    } catch (error) {
      log.addLog(error, "endpoint", "getSubmissionsForBidding");
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

router.post("/saveBidding", auth.ensureAuthenticated, async (req, res) => {
  try {
    if (req.body.bids.length === 0) {
      return res.status(404).send({ msg: "No valid bids were submitted." });
    }

    for (const bid of req.body.bids) {
      await db.fetchDataCst(`
      INSERT INTO biddings (biddingconfid, biddingsubmissionid, biddinguserid, biddingconfidence)
        VALUES (${req.body.confid}, ${bid.submissionid}, ${req.body.userid}, ${bid.confidence})
      `);
    }
    return res.status(200).send({});
  } catch (error) {
    log.addLog(error, "endpoint", "getSubmissionsForBidding");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

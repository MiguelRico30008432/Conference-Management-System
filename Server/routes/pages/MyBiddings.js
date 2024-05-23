const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/getUserBiddings", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
    SELECT
      b.biddingid,
      b.biddingsubmissionid,
      s.submissiontitle,
      b.biddingconfidence
    FROM 
      biddings b
    JOIN 
      submissions s ON b.biddingsubmissionid = s.submissionid
    WHERE
      biddingconfid = ${req.body.confid} AND biddinguserid = ${req.body.userid}
    `);
    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "endpoint", "getSubmissionsForBidding");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/updateBidding", auth.ensureAuthenticated, async (req, res) => {
  try {
    if (req.body.editbids.length > 0) {
      for (const edit of req.body.editbids) {
        await db.fetchDataCst(`
        UPDATE biddings set biddingconfidence = ${edit.biddingconfidence} WHERE biddingid = ${edit.biddingid}
        `);
      }
    }

    if (req.body.deletebids.length > 0) {
      for (const deletebid of req.body.deletebids) {
        await db.fetchDataCst(`
        DELETE FROM biddings WHERE biddingid = ${deletebid.biddingid}
        `);
      }
    }

    return res.status(200).send({});
  } catch (error) {
    log.addLog(error, "endpoint", "getSubmissionsForBidding");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

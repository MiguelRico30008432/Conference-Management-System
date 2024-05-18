const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

const router = express.Router();

router.post("/allEvents", auth.ensureAuthenticated, async (req, res) => {
  try {
    await verifyConferenceDates(req.body.confid);

    const result = await db.queryCst(`
    SELECT
        CONCAT(userfirstname, ' ',userlastname) AS eventuser,
        to_char(eventadddate, 'DD-MM-YYYY') AS eventdate,
        to_char(eventadddate, 'HH24:MI:SS') AS eventhour,
        eventname AS eventname
    FROM events
    INNER JOIN users ON userid = eventuserid
    WHERE eventconfid = ${req.body.confid}`);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "endpoint", "allEvents");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

async function verifyConferenceDates(confid) {
  const result = await db.queryCst(`
    SELECT 
      CASE 
        WHEN c.confstartsubmission <= NOW() AND c.confendsubmission >= NOW() THEN c.confstartsubmission 
        ELSE NULL 
      END AS submission,
      CASE 
        WHEN c.confstartreview <= NOW() AND c.confendreview >= NOW() THEN c.confstartreview
        ELSE NULL 
      END AS review,
      CASE 
        WHEN c.confstartbidding <= NOW() AND c.confendbidding >= NOW() THEN c.confstartbidding
        ELSE NULL 
      END AS bidding
    FROM conferences c
    LEFT JOIN events e ON c.confid = e.eventconfid AND (
        e.eventname LIKE '%The submission period has started%' 
        OR e.eventname LIKE '%The Bidding period has started%' 
        OR e.eventname LIKE '%The Review period has started%'
    )
    WHERE 
      c.confid = ${confid}
      AND (
        (c.confstartsubmission <= NOW() AND c.confendsubmission >= NOW())
        OR (c.confstartreview <= NOW() AND c.confendreview >= NOW())
        OR (c.confstartbidding <= NOW() AND c.confendbidding >= NOW())
      )
      AND e.eventid IS NULL;`);

  if (result.length > 0) {
    if (result[0].submission !== null) {
      await db.createEvent(
        confid,
        1,
        "The submission period has started",
        result[0].submission.toISOString()
      );
    } else if (result[0].review !== null) {
      await db.createEvent(
        confid,
        1,
        "The review period has started",
        result[0].review.toISOString()
      );
    } else if (result[0].bidding !== null) {
      await db.createEvent(
        confid,
        1,
        "The bidding period has started",
        result[0].bidding.toISOString()
      );
    }
  }
}

module.exports = router;

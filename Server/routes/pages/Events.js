const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/allEvents", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
    SELECT
        CONCAT(userfirstname, ' ',userlastname) AS eventuser,
        to_char(eventadddate, 'DD-MM-YYYY') AS eventdate,
        to_char(eventadddate, 'HH24:MI:SS') AS eventhour,
        eventname AS eventname
    FROM events
    INNER JOIN users ON userid = eventuserid
    WHERE eventconfid = ${req.body.confid}`;

    const result = await db.fetchDataCst(query);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

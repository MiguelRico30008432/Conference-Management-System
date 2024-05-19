const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

const router = express.Router();

router.get("/callForPapers", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
    SELECT
        confid AS confid,
        confname AS confname,
        confcountry AS confcountry,
        to_char(confendsubmission, 'DD-MM-YYYY') AS confsubmissionend,
        to_char(confstartdate, 'DD-MM-YYYY') AS confstartdate,
        confareaname AS conftopics
    FROM conferences conf
    INNER JOIN confAreas area ON area.confareaid = conf.confareaid
    WHERE
      confapproved = 2
    AND confstartsubmission <= NOW() AND confendsubmission >= NOW()`);

    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "endpoint", "allEvents");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

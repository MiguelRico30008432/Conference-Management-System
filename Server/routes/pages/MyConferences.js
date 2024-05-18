const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

const router = express.Router();

router.post("/myConferences", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT 
        userRoles.confid AS "id",
        confName,
        conferences.confid,
        STRING_AGG(userrole, ', ') AS userrole
      FROM conferences
      INNER JOIN userRoles ON userRoles.confid = conferences.confid
      WHERE userRoles.userid = ${req.body.userid} AND confenddate >= NOW()
      GROUP BY userRoles.confid, confName, conferences.confid`;

    const result = await db.fetchDataCst(query);
    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "endpoint", "allEvents");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

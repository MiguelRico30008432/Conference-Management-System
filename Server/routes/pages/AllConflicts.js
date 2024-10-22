const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const al = require("../../utility/algorithms");

router.post(
  "/determineConflicts",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const response = await al.conflicAlgorithm(req.body.confid);
      return res.status(200).send({ msg: response });
    } catch (error) {
      return res.status(500).send({ msg: response });
    }
  }
);

router.post("/getConflicts", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
    SELECT 
      conflictid,
      CONCAT(u.userfirstname, ' ', u.userlastname) AS fullname,
      s.submissiontitle,
      c.conflictreason,
      c.conflictuserid
    FROM 
      conflicts c
    JOIN users u ON c.conflictuserid = u.userid
    JOIN submissions s ON c.conflictsubmissionid = s.submissionid
    WHERE
      c.conflictconfid = ${req.body.confid}
    `);
    return res.status(200).send(result);
  } catch (error) {
    log.addLog(error, "database", "AllConflicts -> /getConflicts");
    return res.status(500).send({ msg: "Error fetching conflicts" });
  }
});

router.post(
  "/infoToDeclareConflicts",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataCst(`
    SELECT 
      s.submissionid,
      s.submissiontitle,
      STRING_AGG(DISTINCT a.authorfirstname || ' ' || a.authorlastname, ', ') AS authorfullnames,
      STRING_AGG(DISTINCT u.userid || ': ' || u.userfirstname || ' ' || u.userlastname, ', ') AS committeefullnames
    FROM 
      submissions s
    JOIN 
      authors a ON s.submissionid = a.submissionid
    JOIN 
      userroles ur ON ur.confid = ${req.body.confid} AND ur.userrole IN ('Owner', 'Chair', 'Committee')
    JOIN 
      users u ON u.userid = ur.userid
    LEFT JOIN 
      conflicts c ON c.conflictconfid = ${req.body.confid} 
        AND c.conflictsubmissionid = s.submissionid 
        AND c.conflictuserid = u.userid
    WHERE 
      s.submissionconfid = ${req.body.confid}
      AND c.conflictid IS NULL
    GROUP BY 
      s.submissionid, s.submissiontitle;
    `);

      return res.status(200).send(result);
    } catch (error) {
      log.addLog(error, "database", "AllConflicts -> /infoToDeclareConflicts");
      return res
        .status(500)
        .send({ msg: "Error getting info to declare Conflicts" });
    }
  }
);

router.post("/declareConflict", auth.ensureAuthenticated, async (req, res) => {
  try {
    for (const member of req.body.info.committee) {
      await db.fetchDataCst(`
        INSERT INTO conflicts (conflictconfid, conflictsubmissionid, conflictreason, conflictuserid)
        VALUES (${req.body.confid}, ${req.body.info.id}, 'Conflict Added By The Committee' , ${member.id})
      `);

      verifyBiddingsAfterConflictCheck();
    }

    return res.status(200).send({ msg: "Conflict Created With Success." });
  } catch (error) {
    log.addLog(error, "database", "AllConflicts -> /declareConflict");
    return res.status(500).send({ msg: "Error declaring new conflict" });
  }
});

async function verifyBiddingsAfterConflictCheck() {
  //verificar se já existem biddings que sejam conflitos se sim apagar as mesmas
  const result = await db.fetchDataCst(`
  SELECT b.biddingid
  FROM biddings b
  JOIN conflicts c ON b.biddingconfid = c.conflictconfid 
    AND b.biddingsubmissionid = c.conflictsubmissionid
  JOIN users u ON c.conflictuserid = u.userid
  WHERE b.biddinguserid = u.userid
  `);

  if (result.length > 0) {
    for (const bid of result) {
      await db.fetchDataCst(`
      DELETE FROM biddings WHERE biddingid = ${bid.biddingid}
      `);
    }
  }
}

router.post("/deleteConflict", auth.ensureAuthenticated, async (req, res) => {
  try {
    await db.fetchDataCst(`
      DELETE FROM conflicts WHERE conflictid = ${req.body.info.conflictid}  
    `);

    return res.status(200).send({ msg: "Conflict Deleted With Success." });
  } catch (error) {
    return res.status(500).send({ msg: "Error deleting conflict." });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post(
  "/determineConflicts",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      //Obter lista com os emails do comite, chair, owner e respetivas afiliações
      const committeeEmailsAffiliation = await db.fetchDataCst(`
        SELECT 
            ur.userrole,
            u.useremail,
            u.useraffiliation
        FROM 
            userroles ur
        JOIN 
            users u ON ur.userid = u.userid
        WHERE 
            ur.confid = ${req.body.confid} 
        `);

      //Obter submissões da conferência
      const submissionsids = await db.fetchDataCst(`
        SELECT
            submissionid
        FROM
            submissions
        WHERE
            submissionconfid = ${req.body.confid}
        `);

      //Por submissão obter os emails dos autores
      if (submissionsids.length > 0) {
        for (const submission of submissionsids) {
          const submissionid = submission.submissionid;
          const authorsEmails = await db.fetchDataCst(`
            SELECT
                authorid,
                authoremail,
                authoraffiliation
            FROM 
                authors
            WHERE
                submissionid = ${submissionid}
          `);

          //Por membro do comite verificar se faz parte dos autores ou se é da mesma afiliação que os autores
          for (const committee of committeeEmailsAffiliation) {
            for (const author of authorsEmails) {
              const conflictExists = await db.fetchDataCst(`
                SELECT
                  conflictid
                FROM
                  conflicts
                WHERE
                  conflictconfid = ${req.body.confid} AND conflictuseremail = '${committee.useremail}' AND conflictsubmissionid = ${submission.submissionid}
              `);

              //Verificar primeiro se o conflito já existe
              if (conflictExists.length === 0) {
                //Se o membro do comitte for autor ou se tiver a mesma afiliação que, pelo menos, 1 dos autores, então adicionar na tabela de conflitos

                if (committee.useremail === author.authoremail) {
                  await db.fetchDataCst(`
                  INSERT INTO conflicts(conflictconfid, conflictreason, conflictsubmissionid, conflictuseremail)
                  VALUES(${req.body.confid}, 'Part of the committee as ${committee.userrole} and registered as author.', ${submission.submissionid}, '${committee.useremail}')
                  `);
                } else if (
                  committee.useraffiliation === author.authoraffiliation
                ) {
                  await db.fetchDataCst(`
                  INSERT INTO conflicts(conflictconfid, conflictreason, conflictsubmissionid, conflictuseremail)
                  VALUES(${req.body.confid}, 'Same affiliation has 1 or more authors.', ${submission.submissionid}, '${committee.useremail}')
                  `);
                }
              }
            }
          }
        }
      } else {
        return res
          .status(500)
          .send({ msg: "No submissions where detected for this conference" });
      }

      verifyBiddingsAfterConflictCheck();

      return res.status(200).send({ msg: "Conflicts have been Updated" });
    } catch (error) {
      log.addLog(error, "database", "AllConflicts -> /determineConflicts");
      return res
        .status(500)
        .send({ msg: "Error declaring Conflicts (Algorithm)" });
    }
  }
);

router.post("/getConflicts", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchDataCst(`
    SELECT 
      CONCAT(u.userfirstname, ' ', u.userlastname) AS fullname,
      s.submissiontitle,
      c.conflictreason
    FROM 
      conflicts c
    JOIN users u ON c.conflictuseremail = u.useremail
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
      STRING_AGG(DISTINCT u.userfirstname || ' ' || u.userlastname, ', ') AS committeefullnames,
      STRING_AGG(DISTINCT u.useremail, ', ') AS committeeemails
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
        AND c.conflictuseremail = u.useremail
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
    console.log(req.body.dataToAddConflict);
    await db.fetchDataCst(`
    INSERT INTO conflicts (conflictconfid, conflictsubmissionid, conflictreason, conflictuseremail)
    VALUES (${req.body.confid}, ${req.body.dataToAddConflict.submissionid}, 'Conflict Added By The Committee' , '${req.body.dataToAddConflict.committeeemails}')
    `);
    verifyBiddingsAfterConflictCheck();
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
  JOIN users u ON c.conflictuseremail = u.useremail
  WHERE b.biddinguserid = u.userid
  `);

  console.log(result);
  if (result.length > 0) {
    for (const bid of result) {
      await db.fetchDataCst(`
      DELETE FROM biddings WHERE biddingid = ${bid.biddingid}
      `);
    }
  }
  console.log("verifyBiddingsAfterConflictCheck");
}

module.exports = router;

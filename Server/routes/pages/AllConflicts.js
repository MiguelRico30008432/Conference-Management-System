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
      return res.status(200).send({ msg: "Conflicts have been Updated" });
    } catch (error) {
      log.addLog(error, "database", "AllConflicts -> /determineConflicts");
      return res.status(500).send({ msg: "Error fetching submission data" });
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
    return res.status(500).send({ msg: "Error fetching submission data" });
  }
});

router.post(
  "/infoToDeclareConflicts",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataCst(`
      WITH submission_authors AS (
        SELECT 
          s.submissionid,
          s.submissiontitle,
          STRING_AGG(CONCAT(a.authorfirstname, ' ', a.authorlastname), ', ') AS authors
        FROM 
          submissions s
        JOIN authors a ON s.submissionid = a.submissionid
        GROUP BY 
          s.submissionid
      ),
      committee_info AS (
        SELECT
          ur.confid,
          STRING_AGG(CONCAT(u.userfirstname, ' ', u.userlastname, ' ', '(', u.useremail, ')'), ', ') AS committee
        FROM
          userroles ur
        JOIN users u ON ur.userid = u.userid
        GROUP BY
          ur.confid
      )
      SELECT
        sa.authors,
        sa.submissiontitle,
        sa.submissionid,
        ci.committee
      FROM
        conflicts c
      JOIN submission_authors sa ON c.conflictsubmissionid = sa.submissionid
      JOIN committee_info ci ON c.conflictconfid = ci.confid
      WHERE
        c.conflictconfid = ${req.body.confid}
      `);
      console.log(result);
      return res.status(200).send(result);
    } catch (error) {
      log.addLog(error, "database", "AllConflicts -> /infoToDeclareConflicts");
      return res.status(500).send({ msg: "Error fetching submission data" });
    }
  }
);

router.post("/declareConflict", auth.ensureAuthenticated, async (req, res) => {
  try {
    console.log("estou no endpoint");
    return res.status(200).send();
  } catch (error) {
    log.addLog(error, "database", "AllConflicts -> /declareConflict");
    return res.status(500).send({ msg: "Error fetching submission data" });
  }
});

module.exports = router;

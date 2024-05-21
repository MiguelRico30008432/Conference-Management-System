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
      //Obter lista com email do comite, chair, owner e respetivas afiliação
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
      console.log("committeeEmailsAffiliation:");
      console.log(committeeEmailsAffiliation);
      //Obter submissões da conferência
      const submissionsids = await db.fetchDataCst(`
        SELECT
            submissionid
        FROM
            submissions
        WHERE
            submissionconfid = ${req.body.confid}
        `);
      console.log("submissions ids:");
      console.log(submissionsids);
      //Por submissão obter os emails dos autores
      if (submissionsids && submissionsids.length > 0) {
        for (const submission of submissionsids) {
          const submissionid = submission.submissionid;
          const authorsEmails = await db.fetchDataCst(`
            SELECT
                authorid,
                authoremail
            FROM 
                authors
            WHERE
                submissionid = ${submissionid}
          `);
          console.log("authorsEmails:");
          console.log(authorsEmails);
          //Por autor verificar se faz parte do comite, chair, owner ou se é da mesma afiliação de alguem dos roles mencionados
          for (const author of authorsEmails) {
            
            //Se fizer parte do comite, chair, owner ou tiver a mesma afiliação de alguem dos roles mencionados, então adicionar na tabela de conflitos
          }
        }
      } else {
        return res
          .status(500)
          .send({ msg: "No submissions where detected for this conference" });
      }
      return res.status(200);
    } catch (error) {
      log.addLog(error, "database", "AllConflicts -> /determineConflicts");
      return res.status(500).send({ msg: "Error fetching submission data" });
    }
  }
);

module.exports = router;
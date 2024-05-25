const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const sb = require("../../utility/supabase");

router.post("/updateSubmission", auth.ensureAuthenticated, async (req, res) => {
  try {
    const authors = [];
    const missingAuthorIds = [];
    let index = 0;

    const beforeUpdateListOfAuthorsIDS = await db.fetchDataCst(
      `SELECT 
        authorid
      FROM
        authors
      WHERE
        submissionid = ${req.body.submissionid}
      `
    );

    //update submission
    await db.fetchDataCst(
      `UPDATE submissions SET submissiontitle = '${req.body.title}', submissionabstract = '${req.body.abstract}' WHERE submissionid = ${req.body.submissionid}`
    );

    //update authors
    while (req.body[`author[${index}][firstName]`]) {
      authors.push({
        firstName: req.body[`author[${index}][firstName]`],
        lastName: req.body[`author[${index}][lastName]`],
        email: req.body[`author[${index}][email]`],
        affiliation: req.body[`author[${index}][affiliation]`],
        authorid: req.body[`author[${index}][authorid]`],
      });
      index++;
    }

    for (const author of authors) {
      const firstName = author.firstName;
      const lastName = author.lastName;
      const email = author.email;
      const affiliation = author.affiliation;
      const authorid = author.authorid;

      //verificar se o autor tem conta no site
      const userRegistered = await db.fetchData("users", "useremail", email);

      //tratamento dependendo se o autor já está ou não associado a submissao
      if (authorid === "undefined") {
        //Autor não se encontra associado à submissão
        if (!userRegistered || userRegistered.length === 0) {
          await db.fetchDataCst(
            `INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionid, userid)
              VALUES ('${affiliation}', '${email}', '${firstName}', '${lastName}', ${req.body.submissionid}, null)`
          );
        } else {
          await db.fetchDataCst(
            `INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionid, userid)
              VALUES ('${userRegistered[0].useraffiliation}', '${userRegistered[0].useremail}', '${userRegistered[0].userfirstname}', '${userRegistered[0].userlastname}', ${req.body.submissionid}, ${userRegistered[0].userid})`
          );

          const userRole = await db.fetchDataCst(`
          SELECT userRole AS role 
          FROM userroles 
          WHERE 
            userid = ${userRegistered[0].userid} AND confid = ${req.body.confID} AND userrole = 'Author'`);

          if (userRole.length === 0) {
            await db.fetchDataCst(
              `INSERT INTO userroles (userid, userrole, confid) 
              VALUES (${userRegistered[0].userid}, 'Author', ${req.body.confID})`
            );
          }
        }
      } else {
        //Autor está associado à submissão
        if (!userRegistered || userRegistered.length === 0) {
          await db.fetchDataCst(`
          UPDATE 
            authors
          SET 
              authoraffiliation = '${affiliation}',
              authoremail = '${email}',
              authorfirstname = '${firstName}',
              authorlastname = '${lastName}'
          WHERE authorid = ${authorid}`);
        } else {
          await db.fetchDataCst(`
          UPDATE 
            authors
          SET 
              authoraffiliation = '${userRegistered[0].useraffiliation}',
              authoremail = '${userRegistered[0].useremail}',
              authorfirstname = '${userRegistered[0].userfirstname}',
              authorlastname = '${userRegistered[0].userlastname}'
          WHERE authorid = ${authorid}`);
        }
      }
    }
    //Verificar a necessidade de tirar autores
    //Guardar os Ids dos autores registados na base de dados e os que estão a ser passados para atualizar
    const newAuthorsIds = authors.map((item) => parseInt(item.authorid));
    const oldAuthorsIds = beforeUpdateListOfAuthorsIDS.map(
      (item) => item.authorid
    );

    // Verificar se o ID de autor antigo não está presente na lista de novos IDs de autor
    for (const oldAuthorId of oldAuthorsIds) {
      if (!newAuthorsIds.includes(oldAuthorId)) {
        // Adicionar o ID do autor ausente à lista
        missingAuthorIds.push(oldAuthorId);
      }
    }

    if (missingAuthorIds.length > 0) {
      for (let i = 0; i < missingAuthorIds.length; i++) {
        await db.fetchDataCst(`
        DELETE FROM
          authors
        WHERE
          authorid = ${missingAuthorIds[i]}`);
      }
    }

    //update file
    if (req.files) {
      const mainAuthorID = await db.fetchDataCst(`
      SELECT
        submissionmainauthor
      FROM
        submissions
      WHERE
        submissionid = ${req.body.submissionid}
      `);

      await sb.deleteSubmissionFile(
        req.body.confID,
        req.body.submissionid,
        mainAuthorID[0].submissionmainauthor
      );

      await sb.addSubmissionFiles(
        req.files.file,
        req.body.confID,
        req.body.submissionid,
        mainAuthorID[0].submissionmainauthor
      );
    }

    return res.status(200).json({ message: "Submission updated successfully" });
  } catch (error) {
    log.addLog(error, "updateSubmission", "updateSubmission");
    return res.status(500).send({ msg: error });
  }
});

router.post(
  "/getSubmissionInfo",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const data = await db.fetchDataCst(
        `SELECT
        s.submissionid,
        s.submissionconfid,
        s.submissionmainauthor,
        s.submissiontitle,
        s.submissionabstract,
        a.authorid,
        a.userid,
        a.authorfirstname,
        a.authorlastname,
        a.authoremail,
        a.authoraffiliation
    FROM
        submissions s
    LEFT JOIN
        authors a ON s.submissionid = a.submissionid
    WHERE
        s.submissionid = ${req.body.submissionID}`
      );
      return res.status(200).send(data);
    } catch (error) {
      log.addLog(error, "updateSubmission", "getSubmissionInfo");
      return res.status(500).send({ msg: error });
    }
  }
);

module.exports = router;

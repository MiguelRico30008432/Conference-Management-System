const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const sb = require("../../utility/supabase");

router.post("/updateSubmission", auth.ensureAuthenticated, async (req, res) => {
  try {
    let authors = [];
    let newAuthorsIds = [];
    let index = 0;

    const beforeUpdateListOfAuthorsIDS = await db.fetchDataCst(
      `SELECT 
        authorid
      FROM authors
      WHERE
        submissionid = ${req.body.submissionid}
      `
    );

    //update submission
    await db.fetchDataCst(
      `UPDATE submissions SET submissiontitle = $1, submissionabstract = $2 WHERE submissionid = $3`,
      [req.body.title, req.body.abstract, req.body.submissionid]
    );

    //update authors
    while (req.body[`author[${index}][firstName]`]) {
      authors.push({
        firstName: req.body[`author[${index}][firstName]`],
        lastName: req.body[`author[${index}][lastName]`],
        email: req.body[`author[${index}][email]`],
        affiliation: req.body[`author[${index}][affiliation]`],
        authorid: parseInt(req.body[`author[${index}][authorid]`]),
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
          SELECT userrole  
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
          //Insert new author id
          const newID = await db.fetchDataCst(`
            INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionid, userid)
            VALUES ('${affiliation}', '${email}', '${firstName}', '${lastName}',  ${req.body.submissionid}, null)
            RETURNING authorid;
          `);

          newAuthorsIds.push(newID[0].authorid);
        } else {
          const verifyUserID = await db.fetchDataCst(`
            SELECT 
              userid
            FROM 
              users
            WHERE
              useremail = '${userRegistered[0].useremail}'    
          `);

          //Insert new author id
          const newID = await db.fetchDataCst(`
            INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionid, userid)
            VALUES ('${userRegistered[0].useraffiliation}', '${userRegistered[0].useremail}', '${userRegistered[0].userfirstname}', '${userRegistered[0].userlastname}',${req.body.submissionid}, ${verifyUserID[0].userid} )
            RETURNING authorid;
          `);

          newAuthorsIds.push(newID[0].authorid);

          const userRole = await db.fetchDataCst(`
            SELECT userrole  
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
      }
    }
    //Verificar a necessidade de tirar autores
    //Guardar os Ids dos autores registados na base de dados e os que estão a ser passados para atualizar
    if (beforeUpdateListOfAuthorsIDS.length > 0) {
      for (let i = 0; i < beforeUpdateListOfAuthorsIDS.length; i++) {
        //Recolher os dados do author para depois verificar se é necessário retirar do userroles
        const authorInfo = await db.fetchDataCst(`
          SELECT
            a.userid,
            s.submissionconfid,
            a.authoremail	
          FROM 
            authors a
          JOIN 
            submissions s ON  a.submissionid = s.submissionid	
          WHERE
            authorid = ${beforeUpdateListOfAuthorsIDS[i].authorid}
        `);
        //User deixa de ser autor da submissão
        await db.fetchDataCst(`
        DELETE FROM
          authors
        WHERE
          authorid = ${beforeUpdateListOfAuthorsIDS[i].authorid}`);

        const authorSubmissions = await db.fetchDataCst(`
          SELECT 
            a.authorid
          FROM
            authors a
          JOIN 
            submissions s ON  a.submissionid = s.submissionid
          WHERE
            s.submissionconfid = ${authorInfo[0].submissionconfid} AND (a.userid = ${authorInfo[0].userid} OR  a.authoremail = '${authorInfo[0].email}')
        `);

        if (authorSubmissions.length === 0 && authorInfo[0].userid != null) {
          await db.fetchDataCst(`
            DELETE
            FROM 
              userroles 
            WHERE 
              userid = ${authorInfo[0].userid} AND confid =${authorInfo[0].submissionconfid} AND userrole = 'Author'
          `);
        }
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

    db.createEvent(
      req.body.confID,
      req.body.userid,
      `Submission ${req.body.title} Updated`
    );

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

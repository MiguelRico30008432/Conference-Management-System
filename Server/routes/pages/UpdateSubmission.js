const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const fileUpload = require("express-fileupload");

router.use(fileUpload());

router.post("/updateSubmission", auth.ensureAuthenticated, async (req, res) => {
  try {
    console.log(req.files);
    console.log(req.body);
    const authors = [];
    let index = 0;
    console.log("antes do update submission");
    //update submission
    await db.fetchDataCst(
      `UPDATE submissions SET submissiontitle = '${req.body.title}', submissionabstract = '${req.body.abstract}' WHERE submissionid = ${req.body.submissionid}`
    );
    console.log("antes do update authors");
    //update authors
    while (req.body[`author[${index}][firstName]`]) {
      authors.push({
        firstName: req.body[`author[${index}][firstName]`],
        lastName: req.body[`author[${index}][lastName]`],
        email: req.body[`author[${index}][email]`],
        affiliation: req.body[`author[${index}][affiliation]`],
        authorid: req.body[`author[${index}][authorid]`],
      });
      console.log(authors);
      index++;
    }
    for (const author of authors) {
      const firstName = author.firstName;
      const lastName = author.lastName;
      const email = author.email;
      const affiliation = author.affiliation;
      const AuthorRegistered = await db.fetchDataCst(
        `SELECT
          authorfirstname
        FROM
          authors
        WHERE
          submissionid = '${req.body.submissionid}'`
      );
      if (AuthorRegistered) {
        await db.fetchDataCst(
          `UPDATE
            authors
          SET
            authorfirstname = ${req.body.userid},
            authorlastname = ${req.body.userid},
            authoremail = ${req.body.userid},
            authoraffiliation = ${req.body.userid};
          WHERE
           `
        );
      } else {
        const userRegistered = await db.fetchData("users", "useremail", email);
        if (!userRegistered || userRegistered.length === 0) {
          await db.fetchDataCst(
            `INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionID, userid)
              VALUES ('${affiliation}', '${email}', '${firstName}', '${lastName}', ${req.body.submissionid}, null)`
          );
        } else {
          await db.fetchDataCst(
            `INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionID, userid)
              VALUES ('${userRegistered[0].useraffiliation}', '${userRegistered[0].useremail}', '${userRegistered[0].userfirstname}', '${userRegistered[0].userlastname}', ${req.body.submissionid}, ${userRegistered[0].userid})`
          );
        }
      }
    }
    //update file
    return res.status(200).json({ message: "Submission updated successfully" });
  } catch (error) {
    console.log(error);
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

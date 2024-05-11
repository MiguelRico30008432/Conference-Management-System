const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const multer = require("multer");
const fs = require("fs");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/createSubmission",
  upload.single("file"),
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).send({ msg: "File Not Received" });
      }

      const base64File = file.buffer.toString("base64");

      //insert submission
      const result = await db.fetchDataCst(
        `INSERT INTO submissions (submissionconfID, submissionMainAuthor) VALUES (${req.body.confID}, ${req.body.userid})`
      );

      const submissionid = await db.fetchDataCst(
        `SELECT MAX(submissionid) FROM submissions WHERE submissionconfID = '${file.confID} AND submissionMainAuthor = ${req.body.userid}`
      );

      //insert authors
      req.body.author.forEach(async author => {
        const firstName = author.firstName;
        const lastName = author.lastName;
        const email = author.email;
        const affiliation = author.affiliation;
        
        const userRegistered = await db.fetchDataCst(
          `SELECT * FROM users WHERE useremail = ${email}`
        )
        if (!userRegistered || userRegistered.length === 0){
          await db.fetchDataCst(
            `INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionID, userID) 
            VALUES (${affiliation}, ${email}, ${firstName}, ${lastName}, ${submissionid}, ${null})`
          )
        } else {
          await db.fetchDataCst(
            `INSERT INTO authors (authorAffiliation, authorEmail, authorFirstName, authorLastName, submissionID, userID) 
            VALUES (${userRegistered[0].useraffiliation}, ${userRegistered[0].useremail}, ${userRegistered[0].userfirstname}, ${userRegistered[0].userlastname}, ${submissionid}, ${userRegistered[0].userid})`
          )
        }
      });

      //insert file
      await db.fetchDataCst(
        `INSERT INTO files (fileName, file, submissionID) VALUES ('${file.originalname}', '${base64File}', 2)`
      );

      return res.status(200).send({ msg: "" });
    } catch (error) {
      return res.status(500).send({ msg: error });
    }
  }
);

//router.post("/downloadFile", auth.ensureAuthenticated, async (req, res) => {
//  try {
//    const fileId = req.body.fileid;
//
//    const query = `SELECT fileName, file FROM files WHERE fileid = ${fileId}`;
//    const result = await db.fetchDataCst(query);
//
//    const fileData = result[0];
//
//    // Define o cabeçalho Content-Disposition para definir o nome do arquivo no download
//    res.setHeader(
//      "Content-Disposition",
//      `attachment; filename=${fileData.fileName}`
//    );
//
//    // Define o tipo de conteúdo para forçar o download
//
//    res.setHeader("Content-Type", "application/octet-stream");
//
//    // Envie os dados do arquivo como resposta
//    res.send(Buffer.from(fileData.file, "base64"));
//  } catch (error) {
//    console.error(error);
//    return res.status(500).send({ msg: "Internal Error" });
//  }
//});

module.exports = router;

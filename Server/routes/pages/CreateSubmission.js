const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

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

      const base64File = fs.readFileSync(file.path, { encoding: "base64" });
      fs.unlinkSync(file.path);

      //insert submission
      await db.fetchDataCst(
        `INSERT INTO submissions (confid) VALUES (${file.confID})`
      );

      const submissionid = await db.fetchDataCst(
        `SELECT MAX(submissionid) FROM submissions WHERE confid = '${file.confID}`
      );

      //insert authors
      //await db.fetchDataCst(
      // `INSERT INTO files (fileName, file, submissionID) VALUES ('${file.originalname}', '${base64File}', 2)`
      //);

      //insert file
      await db.fetchDataCst(
        `INSERT INTO files (fileName, file, submissionID) VALUES ('${file.originalname}', '${base64File}', 2)`
      );

      return res.status(200).send({ msg: "" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

router.post("/downloadFile", auth.ensureAuthenticated, async (req, res) => {
  try {
    const fileId = req.body.fileid;

    const query = `SELECT fileName, file FROM files WHERE fileid = ${fileId}`;
    const result = await db.fetchDataCst(query);

    const fileData = result[0];

    // Define o cabeçalho Content-Disposition para definir o nome do arquivo no download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileData.fileName}`
    );

    // Define o tipo de conteúdo para forçar o download

    res.setHeader("Content-Type", "application/octet-stream");

    // Envie os dados do arquivo como resposta
    res.send(Buffer.from(fileData.file, "base64"));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;

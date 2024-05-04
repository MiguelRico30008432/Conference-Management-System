const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const db = require("../../utility/database");

const upload = multer({ dest: "uploads/" });

router.post("/uploadFile", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("File Not Received");
    }

    const base64File = fs.readFileSync(file.path, { encoding: "base64" });

    fs.unlinkSync(file.path);

    const query = `INSERT INTO files (fileName, file, submissionID) VALUES ('${file.originalname}', '${base64File}', 2)`;
    await db.fetchDataCst(query);
    return res.status(200).send({ msg: "" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/downloadFile", async (req, res) => {
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

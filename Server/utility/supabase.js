require("dotenv").config();
const log = require("../logs/logsManagement");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

const { SUPABASEURL, SUPABASEKEY } = process.env;

const supabase = createClient(SUPABASEURL, SUPABASEKEY);

async function addSubmissionFiles(file, confid, submissionid, userid) {
  try {
    const fileBuffer = file.data;

    await supabase.storage
      .from("submission_files")
      .upload(
        confid + "/" + userid + "/" + submissionid + "/" + uuidv4(),
        fileBuffer,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype, // Definir o tipo de conteúdo do arquivo
        }
      );
  } catch (error) {
    log.addLog(error, "supabase", "addSubmissionFiles");
    return res.status(500).send({ msg: error });
  }
}

async function updateSubmissionFile(file, confid, submissionid, userid) {
  try {
    const fileBuffer = file.data;

    const directoryPath = `${confid}/${userid}/${submissionid}/`;

    const { data: existingFiles } = await supabase.storage
      .from("submission_files")
      .list(directoryPath);

    if (existingFiles.length > 0) {
      const fileToDelete = existingFiles[0].name;
      await supabase.storage
        .from("submission_files")
        .remove([directoryPath + fileToDelete]);
    }

    await supabase.storage
      .from("submission_files")
      .upload(
        confid + "/" + userid + "/" + submissionid + "/" + uuidv4(),
        fileBuffer,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype, // Definir o tipo de conteúdo do arquivo
        }
      );
  } catch (error) {
    log.addLog(error, "supabase", "addSubmissionFiles");
    return res.status(500).send({ msg: error });
  }
}

async function deleteSubmissionFile(confid, submissionid, userid) {
    const directoryPath = `${confid}/${userid}/${submissionid}/`;

    const { data: existingFiles } = await supabase.storage
      .from("submission_files")
      .list(directoryPath);

    if (existingFiles.length > 0) {
      const fileToDelete = existingFiles[0].name;
      await supabase.storage
        .from("submission_files")
        .remove([directoryPath + fileToDelete]);
    }
}

async function getSubmissionFile(confid, submissionid, userid) {
    
}

module.exports = {
  addSubmissionFiles,
  updateSubmissionFile,
};

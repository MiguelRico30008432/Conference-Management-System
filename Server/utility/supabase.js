require("dotenv").config();
const log = require("../logs/logsManagement");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

const { SUPABASEURL, SUPABASEKEY } = process.env;

const supabase = createClient(SUPABASEURL, SUPABASEKEY);

async function addSubmissionFiles(file, confid, submissionid, mainAuthorID) {
  // testado
  try {
    const fileBuffer = file.data;

    const { error: uploadError } = await supabase.storage
      .from("submission_files")
      .upload(
        confid + "/" + mainAuthorID + "/" + submissionid + "/" + uuidv4(),
        fileBuffer,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype, // Definir o tipo de conteúdo do arquivo
        }
      );

    if (uploadError) {
      log.addLog(uploadError, "supabase", "addSubmissionFiles (try)");
    }
  } catch (error) {
    log.addLog(error, "supabase", "addSubmissionFiles (catch)");
    return res.status(500).send({ msg: error });
  }
}

async function updateSubmissionFile(file, confid, submissionid, mainAuthorID) {
  try {
    const fileBuffer = file.data;

    const directoryPath = `${confid}/${mainAuthorID}/${submissionid}/`;

    const { data: existingFiles, error: listError } = await supabase.storage
      .from("submission_files")
      .list(directoryPath);

    if (listError) {
      log.addLog(listError, "supabase", "updateSubmissionFile (list Error)");
    }

    if (existingFiles.length > 0) {
      const fileToDelete = existingFiles[0].name;
      const { error: deleteError } = await supabase.storage
        .from("submission_files")
        .remove([directoryPath + fileToDelete]);

      if (deleteError) {
        log.addLog(
          listError,
          "supabase",
          "updateSubmissionFile (delete Error)"
        );
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("submission_files")
      .upload(
        confid + "/" + mainAuthorID + "/" + submissionid + "/" + uuidv4(),
        fileBuffer,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.mimetype, // Definir o tipo de conteúdo do arquivo
        }
      );

    if (uploadError) {
      log.addLog(
        uploadError,
        "supabase",
        "updateSubmissionFile (upload Error)"
      );
    }
  } catch (error) {
    log.addLog(error, "supabase", "addSubmissionFiles");
    return res.status(500).send({ msg: error });
  }
}

async function deleteSubmissionFile(confid, submissionid, mainAuthorID) {
  const directoryPath = `${confid}/${mainAuthorID}/${submissionid}/`;

  const { data: existingFiles, error: listError } = await supabase.storage
    .from("submission_files")
    .list(directoryPath);

  if (listError) {
    log.addLog(error, "supabase", "deleteSubmissionFile (list Error");
  }

  if (existingFiles.length > 0) {
    const fileToDelete = existingFiles[0].name;
    const { error: deleteError } = await supabase.storage
      .from("submission_files")
      .remove([directoryPath + fileToDelete]);

    if (deleteError) {
      log.addLog(error, "supabase", "deleteSubmissionFile (list Error");
    }
  }
}

async function getSubmissionFile(confid, submissionid, mainAuthorID) {
  const directoryPath = `${confid}/${mainAuthorID}/${submissionid}/`;
  try {
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("submission_files")
      .list(directoryPath);

    if (listError) {
      log.addLog(error, "supabase", "getSubmissionFile (list Error");
      return null;
    }

    if (!existingFiles || existingFiles.length === 0) {
      return null;
    }

    const fileToDownload = existingFiles[0].name;
    const filePath = `${directoryPath}${fileToDownload}`;

    const { data, error: downloadError } = await supabase.storage
      .from("submission_files")
      .download(filePath);

    if (downloadError) {
      log.addLog(error, "supabase", "getSubmissionFile (download Error");
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error downloading file:", error.message);
    res.status(500).send({ msg: error.message });
  }
}

module.exports = {
  addSubmissionFiles,
  updateSubmissionFile,
  deleteSubmissionFile,
  getSubmissionFile,
};

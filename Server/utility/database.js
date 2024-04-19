const { Pool } = require("pg");
const log = require("../logs/logsManagement");
require("dotenv").config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});

async function fetchData(table, collum, comparisonValue) {
  // utilizada para qualquer tipo de search onde recebe o nome da tabela, da coluna e do parametro de comparação
  try {
    const queryText = `SELECT * FROM ${table} WHERE ${collum} = $1`;
    const result = await pool.query(queryText, [comparisonValue]);
    return result.rows;
  } catch (err) {
    log.addLog(err, "database", "fetchData");
  }
} // testado para a tabela users

async function addData(table, entryParameters) {
  try {
    const keys = Object.keys(entryParameters);
    const values = Object.values(entryParameters);
    const queryText = `INSERT INTO ${table} (${keys.join(
      ", "
    )}) VALUES (${values
      .map((_, i) => "$" + (i + 1))
      .join(", ")}) RETURNING *;`;

    await pool.query(queryText, values);
    return;
  } catch (err) {
    log.addLog(err, "database", "addData");
    throw err; // Rethrow the error
  }
}

async function deleteData(table, collum, comparisonValue) {
  //utilizada para apagar dados em qualquer tabela onde é recebido o nome da tabela, a coluna e o parametro de comparação para saber que linha apagar
  try {
    const queryText = `DELETE FROM ${table} WHERE ${collum} = $1`;
    await pool.query(queryText, [comparisonValue]);
    return;
  } catch (err) {
    log.addLog(err, "database", "deleteData");
  }
} // testado para a tabela users

async function updateData(table, entryParameters, tableID) {
  //utilizada para atualizar dados em qualquer tabela onde é recebido o nome da tabela, os parametros a atualizar e o ID da linha a atualizar
  // entryParameters = {nome da coluna: "Valor", (...)}   exemplo para a tabela users {username: "Bernardo", useremail:"teste@gmail.com", (...)}
  // tableID = {nome do campo referente ao id: "valor do id"} exemplo para a tabela users {userid: "6"}
  try {
    const keys = Object.keys(entryParameters);
    const values = Object.values(entryParameters);
    const queryText = `UPDATE ${table} SET ${keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(", ")} WHERE ${Object.keys(tableID)} = ${Object.values(tableID)}`;
    await pool.query(queryText, values);
    return;
  } catch (err) {
    log.addLog(err, "database", "updateData");
  }
} // testado para a tabela users

async function fetchDataPendingConferences(collum, comparisonValue) {
  try {
    const queryText = `SELECT 
        conferences.confid AS "id",
        conferences.confname,
        conferences.confdescription,
        to_char(conferences.confstartdate, 'DD-MM-YYYY HH24:MI:SS') AS confstartdate,
        to_char(conferences.confenddate, 'DD-MM-YYYY HH24:MI:SS') AS confenddate,
        to_char(conferences.confstartsubmission, 'DD-MM-YYYY HH24:MI:SS') AS confstartsubmission,
        to_char(conferences.confendsubmission, 'DD-MM-YYYY HH24:MI:SS') AS confendsubmission,
        to_char(conferences.confstartreview, 'DD-MM-YYYY HH24:MI:SS') AS confstartreview,
        to_char(conferences.confendreview, 'DD-MM-YYYY HH24:MI:SS') AS confendreview,
        to_char(conferences.confstartbidding, 'DD-MM-YYYY HH24:MI:SS') AS confstartbidding,
        to_char(conferences.confendbidding, 'DD-MM-YYYY HH24:MI:SS') AS confendbidding,
        confAreas.confareaname,
        conferences.confmaxreviewers,
        conferences.confminreviewers,
        conferences.confmaxsubmissions,
        conferences.confcode,
        conferences.confadddate,
        conferences.confapproved,
        conferences.confOwner
    FROM 
        conferences
    INNER JOIN 
        confareas ON confareas.confareaid = conferences.confareaid
    WHERE ${collum} = $1`;

    const result = await pool.query(queryText, [comparisonValue]);
    return result.rows;
  } catch (err) {
    log.addLog(err, "database", "fetchData");
  }
}

async function fetchUserData(collum, comparisonValue) {
  try {
    const queryText = `SELECT 
       userfirstname,
       userlastname,
       useremail,
       userphone,
       useraffiliation
    FROM 
        users
    WHERE ${collum} = $1`;

    const result = await pool.query(queryText, [comparisonValue]);
    return result.rows;
  } catch (err) {
    log.addLog(err, "database", "fetchData");
  }
}

module.exports = {
  fetchData,
  addData,
  deleteData,
  updateData,
  //customized functions
  fetchDataPendingConferences,
  fetchUserData,
};

const { Pool } = require("pg");
const log = require("../logs/logsManagement");
require("dotenv").config();
const { createClient } = require('@supabase/supabase-js')

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, SUPABASEURL, SUPABASEKEY } = process.env;

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

const supabase = createClient(SUPABASEURL, SUPABASEKEY)

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

async function fetchAllData(table, column) {
  // utilizada para qualquer tipo de search onde recebe o nome da tabela, da coluna e do parametro de comparação
  try {
    const queryText = `SELECT ${column} FROM ${table}`;
    const result = await pool.query(queryText, []);
    return result.rows;
  } catch (err) {
    log.addLog(err, "database", "fetchData");
  }
}

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

async function fetchDataCst(select) {
  try {
    const result = await pool.query(select);
    return result.rows;
  } catch (err) {
    log.addLog(err, "database", "fetchDataCst");
  }
}

async function fetchDataWithJoin(mainTable, joinTable, joinCondition, joinSecondCondition, filterColumn, filterSecondColumn, filterValue, filterSecondValue) {
  try {
    const queryText = `
      SELECT ${filterColumn}
      FROM ${mainTable}
      JOIN ${joinTable} ON ${mainTable}.${joinCondition} = ${joinTable}.${joinCondition}
      WHERE ${joinTable}.${joinSecondCondition} = '${filterValue}' AND ${joinTable}.${filterSecondColumn} = '${filterSecondValue}';
    `;
    const result = await pool.query(queryText);
    // Extract just the email values from the result set
    const emails = result.rows.map(row => row.useremail);
    return emails;
  } catch (err) {
    log.addLog(err, "database", "fetchDataWithJoin");
    throw err; // Rethrow the error
  }
}

async function fetchAllEmailData(mainTable, joinTable, joinCondition, joinSecondCondition, filterColumn, filterSecondColumn, filterValue, filterSecondValue) {
  try {
    const queryText = `
      SELECT ${filterColumn}
      FROM ${mainTable}
      JOIN ${joinTable} ON ${mainTable}.${joinCondition} = ${joinTable}.${joinCondition}
      WHERE ${joinTable}.${joinSecondCondition} = '${filterValue}' AND ${joinTable}.${filterSecondColumn} IN (${filterSecondValue.map(value => `'${value}'`).join(', ')});
    `;
    const result = await pool.query(queryText);
    // Extract just the email values from the result set
    const emails = result.rows.map(row => row.useremail);
    return emails;
  } catch (err) {
    log.addLog(err, "database", "fetchDataWithJoin");
    throw err; // Rethrow the error
  }
}

module.exports = {
  pool,
  supabase,
  fetchData,
  fetchDataCst,
  addData,
  deleteData,
  updateData,
  fetchAllData,
  fetchDataWithJoin,
  fetchAllEmailData,
};

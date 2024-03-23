const { Pool } = require('pg');
const log = require("./logs/logsManagement");
require('dotenv').config();

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

async function fetchData(table, collum, comparisonValue){ // utilizada para qualquer tipo de search onde recebe o nome da tabela, da coluna e do parametro de comparação
    try{
        const queryText = `SELECT * FROM ${table} WHERE ${collum} = $1`;
        const result = await pool.query(queryText, [comparisonValue]);
        console.log(result.rows);
        return result.rows;
    }catch(err){
        log.addLog(err, "database", "fetchData");
    }
}// testado para a tabela users

async function addData(table, entryParameters){ //utilizada para inserir dados em qualquer tabela onde é recebido o nome da tabela e os parametros a inserir
    try{
        const keys = Object.keys(entryParameters);
        const values = Object.values(entryParameters);
        const queryText = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map((_, i) => '$' + (i + 1)).join(', ')})`;
        await pool.query(queryText, values);
        return;
    }catch(err){
        log.addLog(err, "database", "addData");
    }
} //testado para a tabela users

async function deleteData(table, collum, comparisonValue){
    try{
        const queryText = `DELETE FROM ${table} WHERE ${collum} = $1`;
        await pool.query(queryText, [comparisonValue]);
        return;
    }catch(err){
        console.log("deu erro");
        log.addLog(err, "database", "deleteData");
    }
} // testado para a tabela users

module.exports = {
    fetchData,
    addData,
    deleteData,
}
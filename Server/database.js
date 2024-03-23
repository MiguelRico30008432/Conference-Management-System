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
/*
async function teste() {
    console.log("entrei no teste");
    try {
        const queryText = 'Select * from users';
        const { rows } = await pool.query(queryText);
        console.log(rows[0]);
        return (rows);
    }
    catch (error) {
        console.log(error);
    }
    console.log("sai do teste");
}
*/

async function fetchData(table, collum, comparisonValue){ // utilizada para qualquer tipo de search onde recebe o nome da tabela, da coluna e do parametro de comparação
    try{
        const queryText = `SELECT * FROM ${table} WHERE ${collum} = $1`;
        const result = await pool.query(queryText, [comparisonValue]);
        console.log(result.rows);
        return result.rows;
    }catch(err){
        log.addLog(err, "fetchData");
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
        log.addLog(err, "addData");
    }
} //testado para a tabela users

module.exports = {
    fetchData,
    addData,
}
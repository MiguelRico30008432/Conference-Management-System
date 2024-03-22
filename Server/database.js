const { Pool } = require('pg');
const log = require("./logs/logsManagement")
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

async function fetchData( table, collum, comparisonValue){
    try{
        const queryText = `SELECT * FROM ${table} WHERE ${collum} = $1`;
        const result = await pool.query(queryText, [comparisonValue]);
        return result.rows;
    }catch(err){
        log.addLog(err);
    }
}

module.exports = {
    fetchData,
}
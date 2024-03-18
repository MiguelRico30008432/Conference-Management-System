const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT;
const secret = process.env.SECRET;

app.use(cors());
app.options('*', cors())
app.use(express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

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
async function getPgVersion() {
    try{
        const queryText = 'Select * from users';
        const { rows } = await pool.query(queryText);
        console.log(rows[0]);
        return (rows);
    }
   catch(error){
    console.log(error);
   }
}

getPgVersion();
*/

//-----------EndPoints-------------//

//SignUp
app.post("/signUp", async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    //const findUserName = await findOneResult("users", { username: username });

    if (findUserName == null) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { username: username, password: hashedPassword, admin: 0, email: email };
            console.log(newUser);
            //await insertLinesOnDatabase("users", newUser);

            //sendEmail(email);
            return res.status(201).send({ msg:""});
        } catch (error) {
            console.error("Erro ao criar o utilizador: " + error);
            return res.status(500).send({ msg:'Erro interno de servidor'});
        }
    } else {
        console.log("Utilizador já existe");
        return res.status(409).send({ msg: 'Utilizador já existe' });
    }
});


app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

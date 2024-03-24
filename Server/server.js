const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require("./database");
const mail = require("./emails");
const log = require("./logs/logsManagement");
const ver = require("./verifications");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//-----------Zona de Testes-------------//
//const value = {useremail: "apos "}
//const collum = {userid: "6"}
//db.updateData("users", value, collum)
//-----------Zona de Testes-------------//


//-----------EndPoints-------------//

//SignUp
app.post("/signUp", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone = req.body.phone;

    const findUserName = await db.fetchData("users", "username", username);

    if (findUserName == null) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { username: username, useremail: email, userphone: phone, userpassword: hashedPassword};
            db.addData("users", newUser);

            //sendEmail(email);
            return res.status(201).send({ msg: "Utilizador criado com sucesso"});
        } catch (error) {
            console.error("Erro ao criar o utilizador: " + error);
            return res.status(500).send({ msg: 'Erro interno de servidor' });
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
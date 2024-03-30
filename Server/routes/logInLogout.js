const express = require('express');
const router = express.Router(); 
const db = require("../utility/database");
const mail = require("../utility/emails");
const bcrypt = require('bcrypt');

//Login
router.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await db.fetchData("users", "username", username);

    if (!findUser[0]) {
        return res.status(401).send('Credenciais inválidas');
    }

    bcrypt.compare(password, findUser[0].userpassword, function(err, result) {
        if (err) {
            log.addLog(err, "server", "logIn Endpoint // Password Compare");
            return res.status(500).send('Erro interno do servidor');
        }

        if (result) {
            return res.status(201).send("Login efetuado com sucesso");
        } else {
            return res.status(401).send('Credenciais inválidas');
        }
    });
});

//SignUp
router.post("/signUp", async (req, res) => {
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


module.exports = router;
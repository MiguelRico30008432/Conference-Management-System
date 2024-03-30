const express = require("express");
const bodyParser = require('body-parser');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require("./database");
const mail = require("./emails");
const log = require("./logs/logsManagement");
const ver = require("./verifications");
require('./passportStrategies/localStratagy');

const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(SECRET));
app.use(session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 3,
    }
}))

app.use(passport.initialize());
app.use(passport.session());

//-----------Zona de Testes-------------//
app.get("/", (request, response) => {
    request.session.visited = true;
    response.status(201);
});

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
    response.send(200);
});

app.get("/api/auth/status", (request, response) => {
    console.log("auth/status");
    console.log(request.user);
    console.log(request.session);
    response.send(200);
});

app.post("/api/auth/logout", (request, response)=>{
    if (!request.user) return response.sendStatus(400);

    request.logout((err)=>{
        if (err) return response.sendStatus(400);
        response.send(200);
    });
});

//-----------Zona de Testes-------------//


//-----------EndPoints-------------//

//Login
app.post("/login", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await db.fetchData("users", "username", username);

    if (!findUser) {
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
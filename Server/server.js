const express = require("express");
const bodyParser = require('body-parser');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes/index');
const ver = require("./utility/verifications");
const log = require("./logs/logsManagement");
require('./passportStrategies/localStrategy');

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

app.use(routes);

//-----------Zona de Testes-------------//
app.get("/", (request, response) => {
    request.session.visited = true;
    console.log(request.cookies);
    return response.sendStatus(201);
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
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
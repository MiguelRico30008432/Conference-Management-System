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
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    } else {
        // User is not authenticated, respond with a 401 Unauthorized status code
        return res.status(401).send('User is not authenticated');
    }
}



app.get("/", (request, response) => {
    request.session.visited = true;
    console.log(request.cookies);
    return response.sendStatus(200);
});


app.post("/api/auth", passport.authenticate("local"), (request, response) => {
    response.send(200);
});

app.get("/api/auth/status", ensureAuthenticated, (req, res) => {
    //console.log("auth/status");
    console.log(req.user);
    //console.log(req.session);
    res.send(200); 
});

app.post("/api/auth/logout", ensureAuthenticated, (request, response)=>{

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


//Send mail
app.post("/sendMail", async (req, res) => {
    try{
        mail.sendEmail(req.mail, req.subject, req.content);
        return res.status(200).send({ msg: ''});
    }catch(error)
    {
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
   
});

app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
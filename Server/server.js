const express = require("express");
const bodyParser = require('body-parser');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routes = require('./routes/index');
const ver = require("./utility/verifications");
const log = require("./logs/logsManagement");
require('./passportStrategies/localStrategy');
const cors = require('cors');
const db = require("./utility/database");
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

const corsOptions = {
    origin: 'http://localhost:3000', // This should match the URL of your front-end application
    credentials: true, // This is important as it allows the server to send cookies in CORS requests
    optionsSuccessStatus: 200 // For legacy browsers like IE11
  };
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes


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


app.post("/signIn", passport.authenticate("local"), (request, response) => {
    response.send(200);
});

app.post("/signUp", async (req, res) => {
    const { firstName, lastName, password, email, phone } = req.body;

    try {
        const findUserName = await db.fetchData("users", "useremail", email);
        
        if (!findUserName.length) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                userfirstname: firstName,
                userlastname: lastName,
                useremail: email,
                userphone: phone,
                userpassword: hashedPassword
            };

            await db.addData("users", newUser);

            return res.status(201).send({ msg: "Utilizador criado com sucesso"});
        } else {
            console.log("Utilizador já existe");
            return res.status(409).send({ msg: 'Utilizador já existe' });
        }
    } catch (error) {
        console.error("Erro ao criar o utilizador: ", error);
        return res.status(500).send({ msg: 'Erro interno de servidor', error: error.message });
    }
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
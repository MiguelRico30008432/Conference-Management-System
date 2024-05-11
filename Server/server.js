const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const routes = require("./routes/index");
const ver = require("./utility/verifications");
const log = require("./logs/logsManagement");
require("./passportStrategies/localStrategy");
const cors = require("cors");
const db = require("./utility/database");

const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

const allowedOrigins = [
  "https://final-project-cms.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 3,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

//-----------Zona de Testes-------------//

app.get("/", (request, response) => {
  request.session.visited = true;
  return response.sendStatus(200);
});


//Send mail
app.post("/sendMail", async (req, res) => {
  try {
    mail.sendEmail(req.mail, req.subject, req.content);
    return res.status(200).send({ msg: "" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Server Error" });
  }
});

app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

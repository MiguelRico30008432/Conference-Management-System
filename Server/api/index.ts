const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const routes = require("../routes/index")
const ver = require("../utility/verifications");
const log = require("../logs/logsManagement");
require("../passportStrategies/localStrategy");
const cors = require("cors");
const db = require("../utility/database");
const PgSession = require('connect-pg-simple')(session);


const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

const allowedOrigins = [
  "https://ualconf.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: new PgSession({
      pool: db.pool,
      tableName: 'session'
    }),
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 3,
      secure: true
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

module.exports = app;
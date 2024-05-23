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
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

const allowedOrigins = [
  "http://localhost:3000",
  "https://ualconf.vercel.app"
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
    store: new PgSession({
      pool: db.pool,
      tableName: 'session'
    }),
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 3,
      secure: true,
      sameSite: 'none'
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);


app.get("/", (request, response) => {
  request.session.visited = true;
  return response.sendStatus(200);
});

const httpsOptions = {
   key: fs.readFileSync(path.join(__dirname, '/certs/key.pem')),
   cert: fs.readFileSync(path.join(__dirname, '/certs/cert.pem')),
};

const port = 8003;
https.createServer(httpsOptions, app).listen(port, () => {
	console.log(`Listening on port ${port}`);
});

//app.use(express.static("public"));
//app.listen(PORT, "0.0.0.0", () => {
//  console.log(`Server is running on ${PORT}`);
//});

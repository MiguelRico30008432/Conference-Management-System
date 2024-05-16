const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const routes = require("./routes/index");
const db = require("./utility/database");

const app = express();
const PORT = process.env.PORT || 8003;
const SECRET = process.env.SECRET;

const allowedOrigins = [
  "https://ualconf.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pre-flight requests

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to force HTTPS
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

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
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get("/", (req, res) => res.send("Express on Vercel"));

// Additional Preflight Request Handling
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204); // No Content
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

module.exports = app;
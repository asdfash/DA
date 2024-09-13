const express = require("express");
const session = require("express-session");

//security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const app = express();
const port = 3000;

//rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, //time length
  max: 100, //max number of calls
});
app.use(limiter);

// prevent XSS attacks
app.use(xssClean());

// Security HTTP Headers
app.use(helmet());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

//setup CORS - accessible by other domains
app.use(cors());

// Inititalize the app and add middleware
app.set("view engine", "pug"); // Setup the pug
app.use(express.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(session({ secret: "super-secret" })); // Session setup

/** Handle login display and form submit */
app.get("/login", (req, res) => {
  if (req.session.isLoggedIn === true) {
    return res.redirect("/");
  }
  res.render("login", { error: false });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "bob" && password === "1234") {
    req.session.isLoggedIn = true;
    res.redirect(req.query.redirect_url ? req.query.redirect_url : "/");
  } else {
    res.render("login", { error: "Username or password is incorrect" });
  }
});

/** Handle logout function */
app.get("/logout", (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect("/");
});

/** Simulated bank functionality */
app.get("/", (req, res) => {
  res.render("index", { isLoggedIn: req.session.isLoggedIn });
});

app.get("/balance", (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.send("Your account balance is $1234.52");
  } else {
    res.redirect("/login?redirect_url=/balance");
  }
});

app.get("/account", (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.send("Your account number is ACL9D42294");
  } else {
    res.redirect("/login?redirect_url=/account");
  }
});

app.get("/contact", (req, res) => {
  res.send("Our address : 321 Main Street, Beverly Hills.");
});

/** App listening on port */
app.listen(port, () => {
  console.log(`MyBank app listening at http://localhost:${port}`);
});

const express = require("express");
const session = require("express-session");

//security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const apiController = require("./controllers/apiController");

const app = express();
const port = process.env.BACKENDPORT || 3000;

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
app.use(express.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(session({ secret: "super-secret" })); // Session setup

apiController(app);

/** App listening on port */
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

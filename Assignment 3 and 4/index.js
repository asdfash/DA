import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes.js";

const app = express();
const port = process.env.BACKENDPORT || 5000;

//setup CORS - accessible by frontend only
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); //Setup express to take in body data in json
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.json({ code: "B001" });
  }
  next();
}); //handles any error in json

app.use(cookieParser());

// // routing
// app.use(route);
app.use(route);

/** App listening on port */
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

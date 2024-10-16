import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes.js";

const app = express();
const port = process.env.BACKENDPORT || 3000;

//setup CORS - accessible by frontend only
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); //Setup express to take in body data in json
app.use(cookieParser());

//routing
app.use(route);

/** App listening on port */
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

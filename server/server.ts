import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { connectToDB } from "./lib/mongoose";
import routes from "./routes";

dotenv.config();
const PORT = process.env.PORT || 6969;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to Ec-Static API  🎉");
});

const whiteList = JSON.parse(process.env.WHITELIST || "");

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

connectToDB();

app.use(limiter);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

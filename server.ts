import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import authRouter from "./routes/routes.auth";
import configRouter from "./routes/routes.configuration";
import { errorHandler } from "./middlewares/middlewares.error";
import masterDataRouter from "./routes/routes.master.data";

config();

const app = express();

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json());

// connect to mongoose
mongoose.connect(process.env.MONGO_URI!)
    .then(_res => console.log("Connected to mongo db"))
    .catch(err => console.error(err))

// health check route
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Bun server up and running!"
    })
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/config", configRouter);
app.use("/api/v1/master-data", masterDataRouter);
app.use(errorHandler);
app.listen(process.env.PORT ?? 5001,
    () => console.log(`Up and running on port: ${process.env.PORT ?? 5001}`))
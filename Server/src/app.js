import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import helloRoutes from "./routes/hello.routes.js";

const app = express();

// Security + parsing
app.use(helmet());
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

// Routes
app.use("/api/hello", helloRoutes);

export default app;

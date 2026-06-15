import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { corsOptions } from "./config/app.config.js";
import { registerRoutes } from "./routes/index.js";

export const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use("/uploads", express.static("uploads"));

    registerRoutes(app);

    return app;
};

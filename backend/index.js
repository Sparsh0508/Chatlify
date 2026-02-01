import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from "mongoose"
import dbConnect from "./DB/dbConnect.js";
import authRouter from './route/authUser.js'
import messageRouter from './route/messageRoute.js'
import userRouter from './route/userRoute.js'
import cookieParser from "cookie-parser";
import path from "path";

import { app, server } from './Socket/Socket.js'

const __dirname = path.resolve();

// Middleware to check DB connection
const dbCheck = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database connection is not ready. Please try again in a few seconds."
        });
    }
    next();
};

dotenv.config();


app.use(cors());

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', dbCheck, authRouter)
app.use('/api/message', dbCheck, messageRouter)
app.use('/api/user', dbCheck, userRouter)

// Serve static files from the frontend/dist folder if it exists
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(200).json({
                message: "Chatlify API is running. If you're seeing this, the frontend build might not be included in the backend deployment or is at a different URL.",
                status: "success",
                vercel_environment: !!process.env.VERCEL
            });
        }
    });
});

const PORT = process.env.PORT || 8000

// Initialize DB Connection
dbConnect();

if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Working at ${PORT}`);
    })
}

export default app;
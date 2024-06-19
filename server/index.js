import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'

import { app, server } from './socket/index.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("mongodb connected!!");
})
.catch((err) => {
    console.log("mongodb connection failed!!", err);
})

// const app = express();
app.use(express.json({limit:"16Kb"}));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);



// middleware to handle errors.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
server.listen(3000, () => {
    console.log("listening at port 3000");
})
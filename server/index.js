import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("mongodb connected!!");
})
.catch((err) => {
    console.log("mongodb connection failed!!", err);
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("listening at port 3000");
})
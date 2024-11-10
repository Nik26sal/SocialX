import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 5643;
const app = express();
const corsOptions = {
    origin: process.env.CORS,
    credentials: true 
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: "16Kb", extended: true }));
app.use(express.json({ limit: "16Kb" }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to the Blog Site Made By Nikhil Bansal");
});

import userRoutes from './routes/userRoutes.js';
app.use('/user', userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`, {
            dbName: 'Blog',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Server is connected with the database successfully");

        app.listen(port, () => {
            console.log(`Your server is running on port: ${port}`);
        });
    } catch (error) {
        console.log(`Something went wrong during the connection to the database`);
        console.log(`Check::`, error);
    }
})();

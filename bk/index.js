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

// CORS configuration
const corsOptions = {
    origin: process.env.CORS, // This should be your frontend URL, e.g., 'http://localhost:5173'
    credentials: true // This allows cookies to be sent and received
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: "16Kb", extended: true }));
app.use(express.json({ limit: "16Kb" }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to the Blog Site Made By Nikhil Bansal");
});

// Import and use user routes
import userRoutes from './routes/userRoutes.js';
app.use('/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Database connection and server listening
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

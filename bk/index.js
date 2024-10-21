import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config({
    path:'./env'
})

const port = process.env.PORT || 5643

const app = express();

app.use(express.urlencoded(
    {
        limit:"16Kb",
        extended:true
    }
));
app.use(cors(
    {
    options:process.env.CORS,
    credentials:true
    }
));
app.use(cookieParser())
app.use((express.json({
    limit:"16Kb"
})))

app.get('/',(req,res)=>{
    res.send("Welcome to the server made by express")
});

(async()=>{
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGO_URL}/Blog`);
        console.log("Server is connected with the database Successfully")

        app.on('error', (error) => {
            console.log(`Server error:`, error);
        });
        
        app.listen(port, () => {
            console.log(`Your server is running on port: ${port}`);
        });
    } catch (error) {
        console.log(`Something went wrong during the connection to the database`);
        console.log(`Check::`, error);
    }
})();

import userRoutes from './routes/userRoutes.js'
app.use('/user',userRoutes);
app.use((err,res)=>{
    console.error(err.stack);
    res.status(500).json({ message :'Internal server error'})
});


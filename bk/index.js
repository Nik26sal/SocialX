import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import database from "./Database/db.js";
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import likePostRoute from './routes/likePostRoute.js'
import commentRoutes from './routes/commentRoutes.js'



database();

const port = process.env.PORT || 5643;
const app = express();


const corsOptions = {
    origin: 'https://social-x-phi.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
};


app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to the Blog Site Made By Nikhil Bansal");
});


app.use('/user', userRoutes);
app.use('/post',postRoutes);
app.use('/like',likePostRoute);
app.use('/comment',commentRoutes);

app.listen(port, () => {
    console.log(`Your server is running on port: ${port}`);
});
import mongoose from "mongoose";

const database = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/SocialMedia`);
        console.log("Server is connected with the database successfully");
    } catch (error) {
        console.log(`Something went wrong during the connection to the database`);
        console.log(`Check::`, error);
    }
}

export default database;
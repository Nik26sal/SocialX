import mongoose from "mongoose";

const database = async () => {
  try {
    await mongoose.connect(`mongodb+srv://Nikhil:123yougetfree@cluster0.kz2acay.mongodb.net/SocialMedia`);
    console.log("✅ Server is connected with the database successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
};

export default database;

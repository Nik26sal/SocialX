import mongoose from "mongoose";

const database = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      dbName: "SocialMedia",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Server is connected with the database successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
};

export default database;

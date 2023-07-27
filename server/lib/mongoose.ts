import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_LINK = process.env.DBLINK || "";

export const connectToDB = async () => {
  try {
    await mongoose.connect(DB_LINK);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Error while connecting to Database", err);
  }
};

export default mongoose;

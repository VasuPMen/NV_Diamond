import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = process.env.url;

const connect = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connect;

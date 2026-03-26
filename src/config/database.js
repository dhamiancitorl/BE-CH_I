import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function mongoConnect() {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error conectando MongoDB:", error);
    process.exit(1);
  }
}

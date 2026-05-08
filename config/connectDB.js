import mongoose from "mongoose";
import { seedAdmin } from "@/lib/seedAdmin";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "country_communication",
      bufferCommands: false,
    });
  }

  
  cached.conn = await cached.promise;
  console.log("MongoDB Connected");
  
  await seedAdmin();
  return cached.conn;
};

export default connectDB;
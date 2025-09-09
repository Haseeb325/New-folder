import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/Users.js";
import dbConnect from "../lib/dbConnect.js";

// Load environment variables
dotenv.config({ path: ".env" });

async function fixIndexes() {
  await dbConnect();

  try {
    const indexes = await User.collection.indexes();
    console.log("📌 Current indexes:", indexes);

    // Drop wrong index if exists
// Drop firstName & lastName wrong indexes
// await User.collection.dropIndex("firstName_1");
await User.collection.dropIndex("lastName_1");
    console.log("✅ Dropped firstName index");
  } catch (err) {
    if (err.code === 27) {
      console.log("⚠️ Index firstName_1 not found, skipping");
    } else {
      console.error("Error dropping index:", err);
    }
  }

  mongoose.connection.close();
}

fixIndexes();

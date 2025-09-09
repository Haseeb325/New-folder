import mongoose from "mongoose";

import Role from "../models/Role.js";
import User from "../models/Users.js";
import dbConnect from "../lib/dbConnect.js";

import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // explicitly load your .env.local



async function seed() {
  await dbConnect()

  // Insert roles if not exist
  const roles = ["admin", "hr", "employee"];
  for (let name of roles) {
    await Role.updateOne({ name }, { name }, { upsert: true });
  }

  // Find admin role
  const adminRole = await Role.findOne({ name: "admin" });

  // Check if admin user already exists
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
  if (!existingAdmin) {
  
    await User.create({
      firstName:"first",
      lastName:"last",
      username: "admin",
      email: "haseeb4780767@gmail.com",
      password: "12121212",
      role: adminRole._id,
      status: "active",
      createdBy: null,
    });
    console.log("✅ Admin created with email: admin@gmail.com | password: admin123");
  } else {
    console.log("⚠️ Admin already exists.");
  }

 
}

seed();

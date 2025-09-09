import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

console.log("MONGODB_URI =", JSON.stringify(process.env.MONGODB_URI));

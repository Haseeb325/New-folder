// src/scripts/seedDepartment.js
import "dotenv/config";   // add this line at the very top
import dbConnect from "../lib/dbConnect.js";
import Department from "../models/Department.js";

async function seedDepartments() {
  try {
    await dbConnect();

    const departments = [
      { name: "HR" },
      { name: "Designer" },
      { name: "WebDeveloper" },
      { name: "UI/UX" }
    ];
"WebDeveloper", "UI/UX", "HR", "Designer"
    const result = await Department.insertMany(departments);
    console.log("Seeded departments:", result);

    process.exit(0);
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}

seedDepartments();

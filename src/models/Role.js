import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema({
  name: {
    type: String,
    enum: ["admin", "hr", "employee"],
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);

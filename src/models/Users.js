import mongoose, { Schema } from "mongoose";
import Role from "./Role.js"; 
import department from "./Department.js"
import { type } from "os";

const UserSchema = new Schema(
  {
    firstName:{type:String},
    lastName:{type:String},
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

   role: {
  type: Schema.Types.ObjectId,
  ref: "Role",
  required: true,
},

department:{
  type:Schema.Types.ObjectId,
  ref:"Department"

},

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String, default: "" },

    verificationToken: { type: String },
    tokenExpiry: { type: Date },

    createdBy: {
      role: { type: Schema.Types.ObjectId, ref: "Role" },
      userId: { type: Schema.Types.ObjectId, ref: "User" },
    },
   

    CNIC:{
      type:String
    },
    phone:{
type:String
    },
    address:{
      type:String
    },
    dateOfBirth:{
      type:Date
    },
    joiningDate:{
      type:Date
    },
    profileImage:{
      type:String
    },
    prevCompany:{
      type:String
    },
    YOExp:{
      type:String
    },
    EmployementTime:{
      type:String
    },
    jobLevel:{
      type:String
    },
    dateOfResigning:{
      type:Date
    },
    deptInPrevComp:{
type:String
    },
    documents:[{type:String}]


  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);









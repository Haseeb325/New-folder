import dbConnect from "../../../lib/dbConnect";
import Role from "../../../models/Role";
import User from "../../../models/Users";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, username, token, password } = await req.json();

    if (!email || !username || !token || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      email,
      verificationToken: token,
    })
      .populate("role")
      .populate("createdBy.role");

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid token or expired",
      });
    }

    if (user.tokenExpiry < Date.now()) {
      return NextResponse.json({
        success: false,
        message: "Token expired",
      });
    }

    // 🔹 Fix: Only block if password already exists
    if (user.status === "active" && user.password) {
      return NextResponse.json({
        success: true,
        message: "Already verified",
      });
    }

    // ✅ Update credentials
    user.username = username;
    user.password = password;
    user.email = email;
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: `${user.role.name} verified successfully`,
    });
  } catch (error) {
    console.error("Error in verifying employee", error);
    return NextResponse.json({
      success: false,
      message: "Error in verifying employee",
    });
  }
}

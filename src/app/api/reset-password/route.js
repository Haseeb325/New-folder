import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/Users";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, token, newPassword, confirmPassword } = await req.json();

   
    if (!email || !token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

  
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    
    const user = await User.findOne({ email, verificationToken: token });

    if (!user || user.tokenExpiry < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.password = newPassword; 
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in resetting password:", error);
    return NextResponse.json(
      { success: false, message: "Error in resetting the password" },
      { status: 500 }
    );
  }
}

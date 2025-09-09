import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/Users";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../../helper/sendEmailVerification";

export async function POST(req) {
  await dbConnect();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({
        status: false,
        message: "Please enter email",
      });
    }

    // 🔹 Find user by email (HR, Employee, Admin all in User model)
    const user = await User.findOne({ email }).populate("role");

    if (!user) {
      return NextResponse.json({
        status: false,
        message: "No user found",
      });
    }

    // 🔹 Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = resetToken;
    user.tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour expiry
    await user.save();

    // 🔹 Reset link
    const link = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

    // 🔹 Send email
    await sendVerificationEmail(
      email, // to
      "Reset your password", // subject
      "passwordReset", // templateName
      [link] // variables (link will be used in template)
    );

    return NextResponse.json({
      status: true,
      message: `Password reset email sent to ${email}`,
    });
  } catch (error) {
    console.error("Error in sending email", error);
    return NextResponse.json({
      status: false,
      message: "Error in sending email",
    });
  }
}

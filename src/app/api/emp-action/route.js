import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/Users";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { sendVerificationEmail } from "../../../../helper/sendEmailVerification";

export async function PATCH(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );
    }

    const { email, action, reason } = await req.json();

    if (!email || !action) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Nested populate for createdBy.userId & createdBy.role
    const employee = await User.findOne({ email })
      .populate("createdBy.userId")
      .populate("createdBy.role");

    if (!employee) {
      return NextResponse.json({
        success: false,
        message: "No user found",
      });
    }

    if (action === "approve") {
      employee.status = "active";
      employee.rejectionReason = "";
      await employee.save();

      // ✅ Send activation email with password setup link
      const link = `http://localhost:3000/employee/activate?token=${employee.verificationToken}&email=${employee.email}`;

      await sendVerificationEmail(
        employee.email,
        "Set Your Password",
        "employeeActivation", // use activation template
        [link]
      );

      return NextResponse.json({
        success: true,
        message: "Employee approved and activation email sent",
      });
    } else if (action === "reject") {
      employee.status = "rejected";
      employee.rejectionReason = reason || "Rejected by Admin";
      await employee.save();

      // ✅ Notify HR (creator)
      if (employee.createdBy?.userId?.email) {
        await sendVerificationEmail(
          employee.createdBy.userId.email, // HR’s email
          "Employee Rejected",
          "employeeStatusRejectTemplate",
          [reason || "Rejected by Admin", employee.email]
        );
      }

      return NextResponse.json({
        success: true,
        message: "Employee rejected and HR notified",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error in updating status", error);

    return NextResponse.json(
      { success: false, message: "Error in updating the status" },
      { status: 500 }
    );
  }
}

import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../../helper/sendEmailVerification";
import User from "../../../models/Users";
import Role from "../../../models/Role";

export async function POST(request) {
  await dbConnect();

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !["admin", "hr"].includes(token.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 403 }
      );
    }

    const creatorRole = token.role; // admin | hr
    const creatorId = token.sub;

    const { email, type } = await request.json();
    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    let roleName;
    if (creatorRole === "admin") {
      if (["hr", "employee"].includes(type)) roleName = type;
      else
        return NextResponse.json({ success: false, message: "Invalid type" });
    } else if (creatorRole === "hr") {
      if (type !== "employee") {
        return NextResponse.json(
          { success: false, message: "HR can only create employees" },
          { status: 403 }
        );
      }
      roleName = "employee";
    }

    const roleDoc = await Role.findOne({ name: roleName });
    const creatorRoleDoc = await Role.findOne({ name: creatorRole });

    if (!roleDoc || !creatorRoleDoc) {
      return NextResponse.json(
        { success: false, message: "Role not found" },
        { status: 500 }
      );
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60);
    const link = `http://localhost:3000/employee/activate?token=${inviteToken}&email=${email}`;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.status === "active") {
        return NextResponse.json({
          success: false,
          message: `${type} already active`,
        });
      }

      if (creatorRole === "admin" && type === "hr") {
        existingUser.status = "pending";
      } else if (creatorRole === "admin") {
        existingUser.status = "active";
      } else {
        existingUser.status = "pending";
      }

      existingUser.verificationToken = inviteToken;
      existingUser.tokenExpiry = expiry;
      existingUser.createdBy = {
        role: creatorRoleDoc._id,
        userId: creatorId,
      };
      await existingUser.save();

      // ✅ Send email only if Admin created or type is HR
      if (creatorRole === "admin" || type === "hr") {
        await sendVerificationEmail(
          email,
          `Activate your ${type} account`,
          type === "hr" ? "hrActivation" : "employeeActivation",
          [link]
        );
      }

      // ✅ If HR created employee → only Admin gets approval email
      if (creatorRole === "hr" && type === "employee") {
        const approvalLink = `http://localhost:3000/admin/?token=${inviteToken}&email=${email}`;
        const adminRoleDoc = await Role.findOne({ name: "admin" });
        const adminUser = await User.findOne({ role: adminRoleDoc._id });

        if (adminUser) {
          await sendVerificationEmail(
            adminUser.email,
            "Employee Pending Approval",
            "adminApprovalTemplate",
            [email, approvalLink]
          );
        }
      }

      return NextResponse.json(
        {
          success: true,
          message:
            creatorRole === "hr"
              ? "Approval resent to admin only"
              : "Email resent to user",
        },
        { status: 200 }
      );
    }

    // ✅ Create new user
    const newUser = await User.create({
      email,
      role: roleDoc._id,
      status:
        creatorRole === "admin" && type === "hr"
          ? "pending"
          : creatorRole === "admin"
          ? "active"
          : "pending",

      verificationToken: inviteToken,
      tokenExpiry: expiry,
      createdBy: {
        role: creatorRoleDoc._id,
        userId: creatorId,
      },
    });

    // ✅ Send email only if Admin created or type is HR
    if (creatorRole === "admin" || type === "hr") {
      await sendVerificationEmail(
        email,
        `Activate your ${type} account`,
        type === "hr" ? "hrActivation" : "employeeActivation",
        [link]
      );
    }

    // ✅ If HR created employee → only Admin gets approval email
    if (creatorRole === "hr" && type === "employee") {
      const approvalLink = `http://localhost:3000/admin/?token=${inviteToken}&email=${email}`;
      const adminRoleDoc = await Role.findOne({ name: "admin" });
      const adminUser = await User.findOne({ role: adminRoleDoc._id });

      if (adminUser) {
        await sendVerificationEmail(
          adminUser.email,
          "Employee Pending Approval",
          "adminApprovalTemplate",
          [email, approvalLink]
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message:
          creatorRole === "hr"
            ? "Approval sent to admin only"
            : "Email sent to user",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in adding employee", error);
    return NextResponse.json(
      { success: false, message: "Error in adding user" },
      { status: 500 }
    );
  }
}

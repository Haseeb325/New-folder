import Role from "../../../../models/Role";
import User from "../../../../models/Users";
import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

    const employee = await User.findById(id);
    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 }
      );
    }

    // Only admin can delete right now
    if (token.role === "admin") {
      await employee.deleteOne();
      return NextResponse.json(
        { success: true, message: "Employee deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Only admin can delete employees" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error in deleting employee:", error);
    return NextResponse.json(
      { success: false, message: "Error in deleting the employee" },
      { status: 500 }
    );
  }
}

import Employee from "../../../../models/Role";
import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Id is required" },
        { status: 400 }
      );
    }

   
    if (token.role !== "admin" && token.role !== "hr") {
      return NextResponse.json(
        { success: false, message: "Only Admin or HR can update employee" },
        { status: 403 }
      );
    }

  
    const body = await req.json();

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true } // return updated doc
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        { success: false, message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Employee updated successfully", employee: updatedEmployee },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { success: false, message: "Server error while updating employee" },
      { status: 500 }
    );
  }
}

import Role from "../../../../models/Role";
import User from "../../../../models/Users";
import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
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

    const role = await Role.findOne({ name: "employee" });
    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ _id: id, role: role._id }).populate("role");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No User Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching employee", error);
    return NextResponse.json(
      { success: false, message: "Error in fetching" },
      { status: 500 }
    );
  }
}

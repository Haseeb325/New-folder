import dbConnect from "../../../lib/dbConnect";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import User from "../../../models/Users";
import Role from "../../../models/Role";
export async function GET(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized request",
      });
    }

    let users;

    
  const role = await Role.findOne({name:"employee"})
  if(!role){
    return NextResponse.json({
      success:false,
      message:"No role found"
    })
  }

      users = await User.find({role:role._id}).populate("role");
   
    

    return NextResponse.json(
      {
        success: true,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching all employees", error);

    return NextResponse.json({
      success: false,
      message: "Error in fetching all employees",
    });
  }
}

import User from "../../../../models/Users";
import dbConnect from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Un authorize",
      });
    }

    const { id } = await params;
    const user = await User.findById(id)
      .populate("role", "name")
      .populate("department", "name");
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "No user found",
      });
    }
    if (token.id != user._id.toString()) {
      return NextResponse.json({
        success: false,
        message: "Not allowed",
      });
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in fetching profile");
    return NextResponse.json({
      success: false,
      message: "Error in fetching profile",
    });
  }
}

import cloudinary from "../../../../lib/cloudinary";
import mongoose from "mongoose";
import { resolve } from "path";
import { error } from "console";

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    // ✅ Auth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Request" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found" },
        { status: 404 }
      );
    }

    if (token.id !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Not allowed" },
        { status: 403 }
      );
    }

    // ✅ Parse form-data
    const formData = await req.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const designation = formData.get("designation");
    const department = formData.get("department");
    const dateOfBirth = formData.get("dateOfBirth");
    const joiningDate = formData.get("joiningDate");
    const profileImage = formData.get("profileImage"); // file blob
    const prevCompany = formData.get("prevCompany");
    const YOExp = formData.get("YOExp");
    const EmployementTime = formData.get("EmployementTime");
    const jobLevel = formData.get("jobLevel");
    const dateOfResigning = formData.get("dateOfResigning");
    const deptInPrevComp = formData.get("deptInPrevComp");

    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (designation) updateData.designation = designation;
    if (department)
      updateData.department = new mongoose.Types.ObjectId(department);
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (joiningDate) updateData.joiningDate = new Date(joiningDate);
    if (prevCompany) updateData.prevCompany = prevCompany;
    if (YOExp) updateData.YOExp = YOExp;
    if (EmployementTime) updateData.EmployementTime = EmployementTime;
    if (jobLevel) updateData.jobLevel = jobLevel;
    if (dateOfResigning) updateData.dateOfResigning = dateOfResigning;
    if (deptInPrevComp) updateData.deptInPrevComp = deptInPrevComp;

    //  Direct buffer upload (works for images, pdf, docs, etc.)
    if (profileImage && profileImage.name) {
      const buffer = Buffer.from(await profileImage.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "profiles", resource_type: "auto" }, // auto handles pdf, png, etc.
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      updateData.profileImage = uploadResult.secure_url;
    }

    // upload documents
    const documents = formData.getAll("documents");
    if (documents && documents.length > 0) {
      const uploadDocs = [];
      for (const doc of documents) {
        if (doc && doc.name) {
          const buffer = Buffer.from(await doc.arrayBuffer());

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "documents", resource_type: "auto" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              )
              .end(buffer);
          });
          uploadDocs.push(uploadResult.secure_url);
        }
      }
     // If user already has documents, keep them
const existingDocs = user.documents || []
updateData.documents = [...existingDocs , ...uploadDocs]

    }

    //  Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating user", error);
    return NextResponse.json(
      { success: false, message: "Error in updating user" },
      { status: 500 }
    );
  }
}

// s12345678s
// smithdon11112





;

// DELETE /api/profile/[id]/documents
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
 
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } =await params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (token.id !== user._id.toString()) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 403 });
    }

    // Get document URL from request body
const { searchParams } = new URL(req.url);
let documentUrl = searchParams.get("documentUrl");
    if (!documentUrl) {
      return NextResponse.json({ success: false, message: "No document provided" }, { status: 400 });
    }
    if (documentUrl){
      documentUrl = decodeURIComponent(documentUrl.trim())
    }

    //  Remove from DB
user.documents = user.documents.filter((doc) => doc != documentUrl )
    //  Optional: also remove from Cloudinary
    try {
      // Extract public_id from URL
      const publicId = documentUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`documents/${publicId}`, { resource_type: "raw" });
    } catch (err) {
      console.log("Cloudinary delete failed:", err.message);
    }

   await user.save()

    return NextResponse.json(
      { success: true, message: "Document deleted successfully", documents: user.documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting document", error);
    return NextResponse.json({ success: false, message: "Error deleting document" }, { status: 500 });
  }
}

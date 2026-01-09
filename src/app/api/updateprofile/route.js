  import { connectDB } from "@/lib/db";
import users from "@/Models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const conn = await connectDB();
    console.log("connection is ", conn);
    const body = await req.json();
    const { session } = body;
    const url = new URL(req.url);
    const del = url.searchParams.get("delete");
    let Name;
    if (body.name) {
      
      Name = body.name;
    } else {
      Name = session.user.name;
    }
    let Email;
    let emailVerified;
    if (body.email) {
      emailVerified = false;
      Email = body.email;
    } else {
      emailVerified = session.user.emailVerified;
      Email = session.user.email;
    }
    if (del === "true") {
      if (!session.user.email) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      } else {
        const res = await users.deleteOne({ email: session.user.email });
        return NextResponse.json({
          success: true,
          message: "User deleted successfully",
        });
      }
    } else {
      if (!session.user.email) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      } else {
        const res = await users.findOneAndUpdate({ email: session.user.email },{$set:{email:Email,name:Name,emailVerified}});
        return NextResponse.json({
          success: true,
          message: "User updated successfully",
        });
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

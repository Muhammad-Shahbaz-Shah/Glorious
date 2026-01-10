import { connectDB } from "@/lib/db";
import users from "@/Models/userModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const allUsers = await users.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users: allUsers,
    });
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

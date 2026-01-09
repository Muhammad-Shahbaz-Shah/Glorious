import { connectDB } from "@/lib/db";

import Order from "@/Models/orderModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // 1. Import mongoose
import users from "@/Models/userModel";
import Product from "@/Models/productModel";
import Category from "@/Models/categoryModel";

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Convert string ID to MongoDB ObjectId
    // This ensures it matches the { "$oid": "..." } structure in your DB
    const orders = await Order.find({
      user: new mongoose.Types.ObjectId(userId),
    })
      .populate("user", "name email")
      .populate("orderItems.product", "image name price")
      .populate("orderItems.product.category", " name ")
      .lean();

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

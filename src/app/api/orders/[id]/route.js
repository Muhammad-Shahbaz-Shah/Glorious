import { connectDB } from "@/lib/db";
import Order from "@/Models/orderModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch single order by ID
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: order }, { status: 200 });
  } catch (error) {
    console.error("Fetch Order Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

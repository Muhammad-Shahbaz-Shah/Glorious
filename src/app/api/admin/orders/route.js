import { connectDB } from "@/lib/db";
import Order from "@/Models/orderModel";
import Product from "@/Models/productModel";
import User from "@/Models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);

  const delivered = url.searchParams.get("delivered");
  try {
    await connectDB();
    let orders;
    
    const status = url.searchParams.get("status");
    
    if (status === 'delivered') {
       // Strictly Delivered orders
       orders = await Order.find({
         orderStatus: "Delivered",
       })
        .populate("user", "name email")
        .populate({
          path: "orderItems.product",
          model: Product,
          select: "name image",
        })
        .sort({ createdAt: -1 });
    } else if (delivered === 'false') {
      // Active orders (Not Delivered, Not Cancelled)
      orders = await Order.find({
        orderStatus: { $nin: ["Delivered", "Cancelled"] },
      })
        .populate("user", "name email")
        .populate({
          path: "orderItems.product",
          model: Product,
          select: "name image",
        })
        .sort({ createdAt: -1 });

    } else {
      orders = await Order.find({})
        .populate("user", "name email")
        .populate({
          path: "orderItems.product",
          model: Product,
          select: "name image",
        })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({
      message: "Orders fetched successfully",
      success: true,
      orders,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status } = body;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "paid";
    }

    await order.save();

    return NextResponse.json({
      message: "Order status updated successfully",
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { connectDB } from "@/lib/db";
import Order from "@/Models/orderModel";
import Product from "@/Models/productModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { orderId } = await req.json();
  try {
    await connectDB();
    const order = await Order.findOne({ _id: orderId });
    if (order.orderStatus === "delivered") {
      return NextResponse.json({
        message: "order already delivered",
        success: false,
        status: 400,
      });
    } else if (order.orderStatus === "shipped") {
      return NextResponse.json({
        message: "order already shipped",
        success: false,
        status: 400,
      });
    } else if (order.paymentInfo.status === "paid") {
      return NextResponse.json({
        message: "order already paid cant be deleted",
        success: false,
        status: 400,
      });
    } else if (order.paymentInfo.status === "verification pending") {
      return NextResponse.json({
        message: "order verification pending cant be deleted",
        success: false,
        status: 400,
      });
    } else {
      const res = await Order.findOneAndDelete({ _id: orderId });
      const bulkOps = res.orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: item.quantity } },
        },
      }));

      await Product.bulkWrite(bulkOps);

      return NextResponse.json({
        message: "order deleted successfully",
        success: true,
        status: 200,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      success: false,
      status: 500,
    });
  }
}

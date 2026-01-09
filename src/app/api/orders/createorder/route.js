import { connectDB } from "@/lib/db";
import Order from "@/Models/orderModel";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Cart from "@/Models/cartModel";
import { headers } from "next/headers";
import Product from "@/Models/productModel";
export async function POST(req) {
  const body = await req.json();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const order = await Order.create({ ...body, user: session?.user.id });
    const cart = await Cart.findOneAndUpdate({ user: session?.user.id }, { $set: { items: [] } })
    const bulkOps = body.orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    const result = await Product.bulkWrite(bulkOps);
    
    console.log(result)
    return NextResponse.json({ data: order,}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

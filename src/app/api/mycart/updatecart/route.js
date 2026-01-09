import { connectDB } from "@/lib/db";
import Cart from "@/Models/cartModel";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const url = new URL(req.url);
  const body  = await req.json();
  const searchParams = url.searchParams;
  const remove = Boolean(searchParams.get("remove"));
  const updateQuantity = Boolean(searchParams.get("updateQuantity"));
  try {
    await connectDB();
    const itemIdCondition = Array.isArray(body.itemId) ? { $in: body.itemId } : body.itemId;

    if (remove && session) {
      const res = await Cart.findOneAndUpdate(
        { user: session.user.id },
        { $pull: { items: { _id: itemIdCondition } } },
        { new: true }
      );
      return NextResponse.json({ data: res }, { status: 200 });
    }

    if (updateQuantity && session) {
      const res = await Cart.findOneAndUpdate(
        { user: session.user.id },
        { $set: { "items.$[item].quantity": body.quantity } },
        { new: true, arrayFilters: [{ "item._id": itemIdCondition }] }
      );
      return NextResponse.json({ data: res }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

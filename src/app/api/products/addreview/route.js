import { connectDB } from "@/lib/db";
import Product from "@/Models/productModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, productId, rating, comment } = await req.json();
  try {
    const review = {
      user: userId,
      comment,
      rating,
    };
    await connectDB();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    product.reviews.push(review);

    await product.save({ new: true });
    return NextResponse.json(
      { message: "Review added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

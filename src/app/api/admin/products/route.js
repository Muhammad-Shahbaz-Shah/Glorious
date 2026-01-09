import { connectDB } from "@/lib/db";
import Product from "@/Models/productModel";
import Category from "@/Models/categoryModel";
import { NextResponse } from "next/server";
import { deleteFile, storeFile } from "@/lib/supaBaseActions";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") || 20;
    const page = searchParams.get("page") || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments();

    return NextResponse.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();

    // Basic validation
    if (
      !body.name ||
      !body.price ||
      !body.category ||
      !body.image ||
      !body.stock ||
      !body.brand ||
      !body.description
    ) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Ensure image is an array (user might send string or array)
    const images = Array.isArray(body.image) ? body.image : [body.image];

    const product = await Product.create({
      ...body,
      image: images,
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    const { image } = product
    await deleteFile(image)
    await Product.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

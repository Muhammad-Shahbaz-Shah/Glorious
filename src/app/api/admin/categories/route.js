import { connectDB } from "@/lib/db";
import { deleteFile } from "@/lib/supaBaseActions";
import Category from "@/Models/categoryModel";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { name, image, description, company } = body;

    if (!name || !image || !description || !company) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      image,
      description,
      company,
    });

    return NextResponse.json(
      { message: "Category created successfully", category },
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
        { error: "Category ID is required" },
        { status: 400 }
      );
    }
    const cat = await Category.findById(id);
    await deleteFile(cat.image);
    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

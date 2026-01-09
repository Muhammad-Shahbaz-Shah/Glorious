import { connectDB } from "@/lib/db";
import  Category  from "@/Models/categoryModel";
import { NextResponse } from "next/server";
export async function GET(req, res) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  try {
    await connectDB();
    if (id) {
      
      const categories = await Category.findById(id).lean();
      return NextResponse.json({ data: categories, status: 200 });
    }
    else {
      const categories = await Category.find().sort({createdAt:-1}).lean();
      return NextResponse.json({ data: categories, status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ data: { error: error.message }, status: 500 });
  }
}

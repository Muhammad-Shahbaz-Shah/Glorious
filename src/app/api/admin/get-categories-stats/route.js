import { connectDB } from "@/lib/db";
import Category from "@/Models/categoryModel";
import Product from "@/Models/productModel";
import { NextResponse } from "next/server";

export async function GET() {

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  await connectDB();
  try {
    const stats = await Product.aggregate([
      {  
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categories = await Category.find();
    
    const categoryStats = categories.map((category) => {
      const stat = stats.find((s) => s._id?.toString() === category._id.toString());
      return {
        name: category.name,
        count: stat ? stat.count : 0,
      };
    });

    return NextResponse.json(categoryStats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

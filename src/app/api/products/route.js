import { connectDB } from "@/lib/db";
import Product from "@/Models/productModel";
import Category from "@/Models/categoryModel";
import users from "@/Models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("searchQuery") || "";
  const limit = parseInt(searchParams.get("limit")) || 15;
  const page = parseInt(searchParams.get("page")) || 1;
  const id = searchParams.get("id") || "";
  const skip = (page - 1) * limit;

  let filter = {};

  if (category) {
    filter.category = category;
  }
  else if (id) {
    filter._id = id
  }


  try {
    await connectDB();

    if (searchQuery) {
      const matchedCategories = await Category.find({
        name: { $regex: searchQuery, $options: "i" },
      }).select("_id");
      const matchedCatIds = matchedCategories.map((c) => c._id);

      const searchFilter = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { brand: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { category: { $in: matchedCatIds } },
        ],
      };

      if (filter.category) {
        filter = { $and: [filter, searchFilter] };
      } else {
        filter = searchFilter;
      }
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const result = await Product.find(filter)
      .populate([
        { path: "category", select: "name company image" },
        { path: "reviews.user", select: "name image" },
      ])
      .limit(limit)
      .skip(skip)
      .lean();

    return NextResponse.json({
      data: result,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
}

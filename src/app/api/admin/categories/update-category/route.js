import { connectDB } from "@/lib/db";
import { deleteFile } from "@/lib/supaBaseActions";
import Category from "@/Models/categoryModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log(body);
    const { _id, name, description, image, company, isActive } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Category ID is required", status: 400 },
        { status: 400 }
      );
    }

    // The image should already be a URL or the existing image path from the frontend
    // Calling storeFile here with a string/URL would fail as it expects a File object
    
    // Fetch the old category to see if the image changed
    const oldCategory = await Category.findById(_id);
    if (oldCategory && image && oldCategory.image !== image) {
      // Delete the old file from Supabase if a new one is provided
      await deleteFile(oldCategory.image);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name, description, image, company, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Updated Successfully",
      data: updatedCategory,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 }
    );
  }
}
